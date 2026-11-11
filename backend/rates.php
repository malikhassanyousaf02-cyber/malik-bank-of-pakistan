<?php
require __DIR__ . '/helpers.php';
auth_uid();
$fx = fx_rates();
out([
  'source' => $fx['source'],
  'updated' => $fx['updated'],
  'spread' => EXCHANGE_SPREAD,
  'rates' => $fx['rates'],   // 1 USD = ? currency (market rate)
]);
