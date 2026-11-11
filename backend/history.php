<?php
require __DIR__ . '/helpers.php';
$uid = auth_uid();
$limit = min(100, max(1, (int)($_GET['limit'] ?? 50)));

$st = db()->prepare(
  'SELECT t.id, a.currency, t.type, t.amount, t.balance_after, t.note, t.created_at
   FROM transactions t JOIN accounts a ON a.id = t.account_id
   WHERE a.user_id = ? ORDER BY t.id DESC LIMIT ' . $limit
);
$st->execute([$uid]);
out(['transactions' => $st->fetchAll()]);
