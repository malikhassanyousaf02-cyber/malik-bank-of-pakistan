CREATE DATABASE IF NOT EXISTS malikbank CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE malikbank;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  cnic CHAR(13) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  cnic_verified TINYINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  currency CHAR(3) NOT NULL,
  balance DECIMAL(18,2) NOT NULL DEFAULT 0,
  UNIQUE KEY uq_user_cur (user_id, currency),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(18,2) NOT NULL,
  balance_after DECIMAL(18,2) NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (account_id, created_at),
  FOREIGN KEY (account_id) REFERENCES accounts(id)
) ENGINE=InnoDB;

CREATE TABLE insurance_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  premium DECIMAL(12,2) NOT NULL,
  coverage DECIMAL(14,2) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE user_insurance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  premium_paid DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (plan_id) REFERENCES insurance_plans(id)
) ENGINE=InnoDB;

CREATE TABLE rate_limits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  k VARCHAR(120) NOT NULL,
  ts INT NOT NULL,
  INDEX (k, ts)
) ENGINE=InnoDB;

INSERT INTO insurance_plans (name, description, premium, coverage) VALUES
('Suraksha Basic',    'Hadsay aur chhoti bimari ka buniyadi cover',   1000,    100000),
('Suraksha Family',   'Poori family ke liye health cover',             5000,    600000),
('Suraksha Plus',     'Hospital, surgery aur ambulance cover',        25000,   3500000),
('Suraksha Premium',  'Life + health + accident ka bara cover',      100000,  15000000),
('Suraksha Platinum', 'Sab se bara cover, 10 lakh premium plan',    1000000, 160000000);
