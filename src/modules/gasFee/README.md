# Gas Fee Mainnet From Blockchain

Rules:

- Display label: Gas Fee Mainnet From Blockchain
- Source: actual blockchain transaction receipt
- Allocation: 50%
- Recipient: Deployer Wallet
- Deployer Wallet:
  0x4cb09bDC03453f190bf4Db8533f458E6551b260D
- No private key in frontend
- No seed phrase in frontend
- No fake TX hash
- Deployer fee transfer must use Wallet Extension / secure signer
- Every real on-chain fee transfer must have a real TX hash
- Blockchain transaction cannot be deleted from the blockchain

Important:

The actual network gas fee and the Deployer allocation are separate
accounting values.

The application must not claim that the blockchain validator receives
50% of gas fee for the Deployer.
