# Stage 27 — Refill

Refill:
- Super Admin Only
- Active Deployer Wallet
- Amount
- Coin
- Lifetime

Lifetime:
- lifetime = true
- tenorId = null
- expiresAt = null
- tidak menggunakan Tenor Transfer

Admin:
- tidak memiliki akses Refill

Application Mode:
- Refill menjadi operasi internal aplikasi.

Smart Contract Mode:
- Jika Deployer mempunyai hak mint:

Refill
↓
Mint
↓
Blockchain
↓
TX Hash
↓
Etherscan

Credential Deployer tidak ditaruh di frontend.
