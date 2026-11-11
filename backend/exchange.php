<?php
require __DIR__ . '/helpers.php';
require_method('POST');
$uid = auth_uid();
$d = input();

$from = strtoupper((string)($d['from'] ?? ''));
$to   = strtoupper((string)($d['to'] ?? ''));
if (!preg_match('/^[A-Z]{3}$/', $from) || !preg_match('/^[A-Z]{3}$/', $to)) fail('Currency sahi chunein');
if ($from === $to) fail('Dono currency alag honi chahiye');
$amount = parse_amount($d['amount'] ?? 0, 100000000);

$fx = fx_rates();
$mid = mid_rate($fx['rates'], $from, $to);
$rate = $mid * (1 - EXCHANGE_SPREAD);      // customer ko 5% kam
$got = round($amount * $rate, 2);
if ($got <= 0) fail('Amount bohat chhota hai');

$pdo = db();
$pdo->beginTransaction();
$a = account_locked($uid, $from, true);
$b = account_locked($uid, $to, true);
$note = sprintf('%s %s -> %s %s (rate %.4f)', number_format($amount, 2), $from, number_format($got, 2), $to, $rate);
move($a, -$amount, 'exchange_out', $note);
$newTo = move($b, $got, 'exchange_in', $note);
$pdo->commit();

out(['message' => "Exchange ho gaya: $got $to", 'received' => $got, 'rate' => $rate, 'balance_to' => $newTo]);
