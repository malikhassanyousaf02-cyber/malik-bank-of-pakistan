<?php
// Copy this file to config.php and fill in your own values.
define('DB_HOST', 'localhost');
define('DB_NAME', 'malikbank');
define('DB_USER', 'root');
define('DB_PASS', '');

define('BANK_NAME', 'Malik Bank of Pakistan');
define('JWT_SECRET', 'replace-with-a-long-random-string');
define('TOKEN_TTL', 3600);        // token lifetime in seconds
define('EXCHANGE_SPREAD', 0.05);  // 5% spread on currency exchange
define('WELCOME_BONUS', 10000);   // starting balance for new users (PKR)
