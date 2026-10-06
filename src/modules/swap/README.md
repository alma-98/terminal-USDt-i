# Stage #29 — Swap + PancakeSwap

Requirement:

Input:
- Token pair
- Amount
- Wallet

Output:
- Swap quote
- Swap transaction

Rules:
- PancakeSwap
- Network harus didukung
- Swap Pair/Pool harus tersedia
- Router harus valid
- Allocation harus active
- Expired allocation tidak dapat digunakan
- Revoked allocation tidak dapat digunakan
- Wallet Extension digunakan untuk transaksi
- Quote bukan transaksi blockchain
- Real transaction menghasilkan TX Hash
- Tidak ada private key di frontend
- Tidak ada seed phrase di frontend
- Tidak membuat TX hash palsu
