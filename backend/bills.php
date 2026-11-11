<?php
require __DIR__ . '/helpers.php';
$uid = auth_uid();
$companies = ['Electricity', 'Gas', 'Water', 'Internet', 'Mobile Load', 'Education'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') out(['companies' => $companies]);
require_method('POST');

$d = input();
$company = (string)($d['company'] ?? '');
$consumer = preg_replace('/[^0-9A-Za-z\-]/', '', $d['consumer_no'] ?? '');
if (!in_array($company, $companies, true)) fail('Company chunein');
if (strlen($consumer) < 5 || strlen($consumer) > 20) fail('Consumer number sahi likhein');
$amount = parse_amount($d['amount'] ?? 0, 1000000);

$pdo = db();
$pdo->beginTransaction();
$acc = account_locked($uid, 'PKR', true);
$bal = move($acc, -$amount, 'bill', "$company bill ($consumer)");
$pdo->commit();

out(['message' => "$company bill ada ho gaya", 'balance' => $bal]);
