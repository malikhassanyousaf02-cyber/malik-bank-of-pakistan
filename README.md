# Malik Bank of Pakistan

A mobile banking app built as a **portfolio project**. It is not a licensed bank and does not handle real money.

**Stack:** React Native (Expo) + PHP REST API + MySQL

## Features

- Register and sign in with CNIC (format check; CNIC verification stays "pending", NADRA integration is out of scope)
- Account balance, transaction history
- Send money to another user by mobile number
- Bill payment (electricity, gas, water, internet, mobile load, education)
- Insurance plans from Rs. 1,000 to Rs. 10 lakh premium, join and pay in-app
- Currency exchange for 150+ currencies with live rates and a configurable 5% spread
- English and Urdu (اردو) interface, switchable at any time

## Security measures

- Passwords hashed with `password_hash()` (bcrypt)
- Prepared statements everywhere (SQL injection protection)
- Signed JWT (HS256) sessions with expiry
- Rate limiting on login, registration and transfers
- Database transactions with row locks, so balances stay consistent
- Input validation on every endpoint

> No application is 100% unhackable. A production deployment would also need HTTPS, a secrets manager, audit logging, 2FA and a security review.

## Project structure

```
backend/   PHP REST API + schema.sql
app/       React Native (Expo) source: App.js and src/
```

## API endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `register.php` | POST | Create account |
| `login.php` | POST | Sign in, returns token |
| `me.php` | GET | Profile and balances |
| `history.php` | GET | Transaction history |
| `transfer.php` | POST | Send money |
| `bills.php` | GET/POST | Pay a bill |
| `insurance.php` | GET/POST | List plans, join a plan |
| `rates.php` | GET | Exchange rates |
| `exchange.php` | POST | Convert between currencies |

## Run it locally

### Backend

1. Install XAMPP and start Apache and MySQL.
2. Copy the `backend` folder to `C:\xampp\htdocs\malikbank`.
3. In phpMyAdmin, run `schema.sql`.
4. Copy `config.example.php` to `config.php` and set your own `JWT_SECRET`.

### Mobile app

```bash
npx create-expo-app@latest malikbank-app --template blank
cd malikbank-app
npx expo install expo-secure-store @expo/vector-icons
```

Copy `App.js` and the `src` folder from `app/` into the new project, add your logo as `assets/logo.png`, set your PC's IP in `src/config.js`, then run:

```bash
npx expo start
```

Scan the QR code with Expo Go. Phone and PC must be on the same WiFi.

## Disclaimer

Portfolio project, not a licensed bank. Use fake test data only. Do not enter real CNIC numbers.

## Author

Malik Hassan Yousaf, Sargodha, Pakistan
