<?php
require __DIR__ . '/helpers.php';
$uid = auth_uid();
$pdo = db();

$st = $pdo->prepare('SELECT id, full_name, cnic, phone, cnic_verified, created_at FROM users WHERE id = ?');
$st->execute([$uid]);
$u = $st->fetch();
if (!$u) fail('User nahi mila', 404);

$st = $pdo->prepare('SELECT currency, balance FROM accounts WHERE user_id = ? ORDER BY currency = "PKR" DESC, currency');
$st->execute([$uid]);

out([
  'bank' => BANK_NAME,
  'user' => [
    'full_name' => $u['full_name'],
    'cnic' => $u['cnic'],
    'phone' => $u['phone'],
    'verified' => (bool)$u['cnic_verified'],
    'member_since' => $u['created_at'],
    'account_no' => 'MBP' . str_pad((string)$u['id'], 9, '0', STR_PAD_LEFT),
  ],
  'accounts' => $st->fetchAll(),
]);
