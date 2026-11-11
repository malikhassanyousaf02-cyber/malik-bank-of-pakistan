<?php
require __DIR__ . '/helpers.php';
require_method('POST');
$d = input();

$name  = trim($d['full_name'] ?? '');
$cnic  = preg_replace('/\D/', '', $d['cnic'] ?? '');
$phone = preg_replace('/\D/', '', $d['phone'] ?? '');
$pass  = (string)($d['password'] ?? '');

if (mb_strlen($name) < 3 || mb_strlen($name) > 100) fail('Poora naam likhein');
if (!preg_match('/^\d{13}$/', $cnic)) fail('CNIC 13 digits ka hona chahiye');
if (!preg_match('/^(03\d{9}|923\d{9})$/', $phone)) fail('Phone number sahi likhein (03XXXXXXXXX)');
if (strlen($pass) < 8 || !preg_match('/[A-Za-z]/', $pass) || !preg_match('/\d/', $pass))
  fail('Password kam az kam 8 characters, harf aur number ke saath');

$phone = preg_replace('/^92/', '0', $phone);
$ip = $_SERVER['REMOTE_ADDR'] ?? 'x';
rate_check("reg:$ip", 10, 3600);
rate_hit("reg:$ip");

$pdo = db();
$st = $pdo->prepare('SELECT id FROM users WHERE cnic = ? OR phone = ?');
$st->execute([$cnic, $phone]);
if ($st->fetch()) fail('CNIC ya phone pehle se registered hai', 409);

$pdo->beginTransaction();
$pdo->prepare('INSERT INTO users (full_name, cnic, phone, password_hash, cnic_verified) VALUES (?,?,?,?,0)')
    ->execute([$name, $cnic, $phone, password_hash($pass, PASSWORD_DEFAULT)]);
$uid = (int)$pdo->lastInsertId();
$pdo->prepare("INSERT INTO accounts (user_id, currency, balance) VALUES (?, 'PKR', 0)")->execute([$uid]);
$acc = account_locked($uid, 'PKR');
move($acc, WELCOME_BONUS, 'credit', 'Welcome bonus');
$pdo->commit();

out(['message' => 'Registration successful. Welcome to ' . BANK_NAME, 'token' => jwt_make($uid)], 201);
