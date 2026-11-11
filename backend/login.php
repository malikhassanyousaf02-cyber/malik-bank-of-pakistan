<?php
require __DIR__ . '/helpers.php';
require_method('POST');
$d = input();
$cnic = preg_replace('/\D/', '', $d['cnic'] ?? '');
$pass = (string)($d['password'] ?? '');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'x';

rate_check("login:$cnic", 5, 900);
rate_check("loginip:$ip", 30, 900);

$st = db()->prepare('SELECT * FROM users WHERE cnic = ?');
$st->execute([$cnic]);
$u = $st->fetch();

if (!$u || !password_verify($pass, $u['password_hash'])) {
  rate_hit("login:$cnic");
  rate_hit("loginip:$ip");
  fail('CNIC ya password galat hai', 401);
}
out(['token' => jwt_make((int)$u['id']), 'name' => $u['full_name'], 'bank' => BANK_NAME]);
