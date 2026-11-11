<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

function db(): PDO {
  static $pdo = null;
  if (!$pdo) {
    $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4', DB_USER, DB_PASS, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ]);
  }
  return $pdo;
}

function out($data = [], int $code = 200): void {
  http_response_code($code);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}
function fail(string $msg, int $code = 400): void { out(['error' => $msg], $code); }

function input(): array {
  $d = json_decode(file_get_contents('php://input'), true);
  return is_array($d) ? $d : [];
}

function require_method(string $m): void {
  if (($_SERVER['REQUEST_METHOD'] ?? '') !== $m) fail('Method not allowed', 405);
}

// ---------- JWT (HS256) ----------
function b64u(string $s): string { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); }
function b64u_dec(string $s): string { return base64_decode(strtr($s, '-_', '+/')); }

function jwt_make(int $uid): string {
  $h = b64u(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
  $p = b64u(json_encode(['uid' => $uid, 'iat' => time(), 'exp' => time() + TOKEN_TTL]));
  $s = b64u(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
  return "$h.$p.$s";
}

function jwt_uid(string $t): ?int {
  $parts = explode('.', $t);
  if (count($parts) !== 3) return null;
  [$h, $p, $s] = $parts;
  $calc = b64u(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
  if (!hash_equals($calc, $s)) return null;
  $pl = json_decode(b64u_dec($p), true);
  if (!$pl || ($pl['exp'] ?? 0) < time()) return null;
  return (int)$pl['uid'];
}

function auth_uid(): int {
  $h = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
  if (!$h && function_exists('getallheaders')) {
    foreach (getallheaders() as $k => $v) if (strtolower($k) === 'authorization') $h = $v;
  }
  if (!preg_match('/^Bearer\s+(.+)$/i', $h, $m)) fail('Login required', 401);
  $uid = jwt_uid(trim($m[1]));
  if (!$uid) fail('Session expired. Dobara login karein', 401);
  return $uid;
}

// ---------- Rate limiting ----------
function rate_check(string $key, int $max, int $windowSec): void {
  $pdo = db();
  $pdo->prepare('DELETE FROM rate_limits WHERE ts < ?')->execute([time() - 86400]);
  $st = $pdo->prepare('SELECT COUNT(*) c FROM rate_limits WHERE k = ? AND ts > ?');
  $st->execute([$key, time() - $windowSec]);
  if ((int)$st->fetch()['c'] >= $max) fail('Bohat zyada koshishein. Thori der baad try karein', 429);
}
function rate_hit(string $key): void {
  db()->prepare('INSERT INTO rate_limits (k, ts) VALUES (?, ?)')->execute([$key, time()]);
}

// ---------- Money helpers ----------
function parse_amount($v, float $max = 100000000): float {
  if (!is_numeric($v)) fail('Amount sahi likhein');
  $a = round((float)$v, 2);
  if ($a <= 0) fail('Amount zero se zyada hona chahiye');
  if ($a > $max) fail('Amount limit se zyada hai');
  return $a;
}

// Account fetch (row lock ke saath). Zarurat par naya account banata hai.
function account_locked(int $uid, string $cur, bool $create = false): ?array {
  $pdo = db();
  $st = $pdo->prepare('SELECT * FROM accounts WHERE user_id = ? AND currency = ? FOR UPDATE');
  $st->execute([$uid, $cur]);
  $a = $st->fetch();
  if (!$a && $create) {
    $pdo->prepare('INSERT INTO accounts (user_id, currency, balance) VALUES (?, ?, 0)')->execute([$uid, $cur]);
    $st->execute([$uid, $cur]);
    $a = $st->fetch();
  }
  return $a ?: null;
}

// Balance badlo + transaction record likho
function move(array $acc, float $delta, string $type, string $note): float {
  $new = round((float)$acc['balance'] + $delta, 2);
  if ($new < 0) { db()->rollBack(); fail('Balance kaafi nahi hai'); }
  $pdo = db();
  $pdo->prepare('UPDATE accounts SET balance = ? WHERE id = ?')->execute([$new, $acc['id']]);
  $pdo->prepare('INSERT INTO transactions (account_id, type, amount, balance_after, note) VALUES (?,?,?,?,?)')
      ->execute([$acc['id'], $type, $delta, $new, $note]);
  return $new;
}

// ---------- Exchange rates ----------
function fx_rates(): array {
  $cache = sys_get_temp_dir() . '/malikbank_rates.json';
  if (is_file($cache) && time() - filemtime($cache) < 3600) {
    $d = json_decode(file_get_contents($cache), true);
    if ($d) return $d;
  }
  $ctx = stream_context_create(['http' => ['timeout' => 5]]);
  $raw = @file_get_contents('https://open.er-api.com/v6/latest/USD', false, $ctx);
  $j = $raw ? json_decode($raw, true) : null;
  if ($j && ($j['result'] ?? '') === 'success' && !empty($j['rates'])) {
    $data = ['source' => 'live', 'updated' => $j['time_last_update_utc'] ?? '', 'rates' => $j['rates']];
    file_put_contents($cache, json_encode($data));
    return $data;
  }
  if (is_file($cache)) { $d = json_decode(file_get_contents($cache), true); if ($d) return $d; }
  // Offline fallback (andazan rates)
  return ['source' => 'fallback', 'updated' => '', 'rates' => [
    'USD' => 1, 'PKR' => 280, 'EUR' => 0.92, 'GBP' => 0.79, 'AED' => 3.67, 'SAR' => 3.75,
    'CNY' => 7.2, 'INR' => 83, 'JPY' => 150, 'CAD' => 1.36, 'AUD' => 1.52, 'TRY' => 32,
  ]];
}

// 1 'from' = ? 'to' (market rate)
function mid_rate(array $rates, string $from, string $to): float {
  if (!isset($rates[$from]) || !isset($rates[$to])) fail('Currency available nahi hai');
  return $rates[$to] / $rates[$from];
}
