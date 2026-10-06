# Terminal-USDt-i

Project baru Terminal-USDt.

## Project

- Firebase: terminal-usdt.web.app
- Default Network: Ethereum Mainnet
- Provider: Alchemy / Infura / Default RPC / Custom RPC
- Mode: Without Smart Contract / With Smart Contract

## Roles

- Super Admin
- Admin

## Core Modules

- Authentication
- Dashboard
- Coin CRUD
- Tenor CRUD
- Deployer Wallet
- Admin Wallet
- Destination Wallet
- Allocation
- Transfer
- Hash x Hash
- Swap
- Refill
- Burn
- Pause
- Revoke Mint
- Provider
- Network
- Audit Log

## Fee Jaringan

Untuk transaksi yang dilakukan oleh role `ADMIN`:

- Label UI: `Fee Jaringan`
- Persentase: `80%`
- Recipient: Super Admin / Deployer Wallet
- Recipient Wallet: `0x4cb09bDC03453f190bf4Db8533f458E6551b260D`
- Dicatat pada collection `networkFees`
- Harus masuk Audit Log
- Tidak menyimpan private key atau seed phrase di frontend

Catatan:
Fee Jaringan pada Control Center merupakan fee aplikasi.
Gas blockchain tetap merupakan biaya jaringan blockchain.

## Fee Jaringan — Visibility Policy

### ADMIN

Admin hanya melihat:

- Fee Jaringan
- Persentase fee
- Nilai fee
- Amount transaksi
- Status transaksi

Admin tidak menerima atau menampilkan:

- Deployer Wallet address
- Recipient internal
- Recipient role internal

### SUPER ADMIN

Super Admin dapat melihat:

- Fee Jaringan
- Recipient internal
- Deployer Wallet
- Transaction Evidence
- Audit Log

Recipient internal tetap disimpan untuk audit dan rekonsiliasi.
UI Admin tidak menerima field recipient.

