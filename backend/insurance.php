<?php
require __DIR__ . '/helpers.php';
$uid = auth_uid();
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $plans = $pdo->query('SELECT * FROM insurance_plans ORDER BY premium')->fetchAll();
  $st = $pdo->prepare(
    'SELECT ui.id, ui.plan_id, p.name, ui.premium_paid, p.coverage, ui.status, ui.joined_at
     FROM user_insurance ui JOIN insurance_plans p ON p.id = ui.plan_id
     WHERE ui.user_id = ? ORDER BY ui.id DESC'
  );
  $st->execute([$uid]);
  out(['plans' => $plans, 'mine' => $st->fetchAll()]);
}

require_method('POST');
$planId = (int)(input()['plan_id'] ?? 0);
$st = $pdo->prepare('SELECT * FROM insurance_plans WHERE id = ?');
$st->execute([$planId]);
$plan = $st->fetch();
if (!$plan) fail('Plan nahi mila', 404);

$st = $pdo->prepare("SELECT id FROM user_insurance WHERE user_id = ? AND plan_id = ? AND status = 'active'");
$st->execute([$uid, $planId]);
if ($st->fetch()) fail('Aap is plan mein pehle se shamil hain', 409);

$pdo->beginTransaction();
$acc = account_locked($uid, 'PKR', true);
$bal = move($acc, -(float)$plan['premium'], 'insurance', 'Insurance premium: ' . $plan['name']);
$pdo->prepare('INSERT INTO user_insurance (user_id, plan_id, premium_paid) VALUES (?,?,?)')
    ->execute([$uid, $planId, $plan['premium']]);
$pdo->commit();

out(['message' => $plan['name'] . ' mein shamil ho gaye', 'balance' => $bal]);
