<?php
require __DIR__ . '/helpers.php';
require_method('POST');
$uid = auth_uid();
$d = input();

$phone = preg_replace('/\D/', '', $d['phone'] ?? '');
$phone = preg_replace('/^92/', '0', $phone);
$amount = parse_amount($d['amount'] ?? 0, 10000000);
$note = mb_substr(trim($d['note'] ?? ''), 0, 100);

rate_check("tx:$uid", 20, 3600);
rate_hit("tx:$uid");

$pdo = db();
$st = $pdo->prepare('SELECT id, full_name FROM users WHERE phone = ?');
$st->execute([$phone]);
$to = $st->fetch();
if (!$to) fail('Is number par koi account nahi mila', 404);
if ((int)$to['id'] === $uid) fail('Apne aap ko paise nahi bhej sakte');

$pdo->beginTransaction();
// deadlock se bachne ke liye hamesha chhoti user id pehle lock karo
$ids = [$uid, (int)$to['id']]; sort($ids);
foreach ($ids as $i) account_locked($i, 'PKR', true);
$from = account_locked($uid, 'PKR');
$dest = account_locked((int)$to['id'], 'PKR');

$sender = $pdo->prepare('SELECT full_name FROM users WHERE id = ?');
$sender->execute([$uid]);
$sn = $sender->fetch()['full_name'];

$bal = move($from, -$amount, 'transfer_out', 'Transfer to ' . $to['full_name'] . ($note ? " - $note" : ''));
move($dest, $amount, 'transfer_in', 'Received from ' . $sn . ($note ? " - $note" : ''));
$pdo->commit();

out(['message' => 'Rs. ' . number_format($amount, 2) . ' ' . $to['full_name'] . ' ko bhej diye gaye', 'balance' => $bal]);
