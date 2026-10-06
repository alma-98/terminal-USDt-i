# Stage 26 — Controller TX

Controller TX mendukung:

- Create
- View
- Edit
- Delete record

Hash:

- 1 × 1
- 1 × N
- Hash #1
- Hash #2
- Hash #3
- Hash #N

Setiap hash dapat:
- Add
- Edit
- Delete record

Edit hash mencatat:
- old
- new
- reason
- user
- time

REAL ON-CHAIN:

Controller TX
↓
Wallet Extension
↓
Sign
↓
Broadcast
↓
Blockchain
↓
REAL TX HASH
↓
Verification
↓
Confirmation
↓
Explorer

Delete hanya menghapus record aplikasi.

Transaksi yang sudah berada di blockchain tidak
dihapus dari blockchain.
