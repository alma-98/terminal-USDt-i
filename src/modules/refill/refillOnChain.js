/*
 * On-chain refill menggunakan Smart Contract.
 *
 * Signing credential Deployer tidak disimpan di frontend.
 * Backend harus menyediakan secure signer/transaction service.
 */

export async function executeOnChainRefill({
  refillId,
  coinContract,
  deployerWallet,
  amount,
  mintFunction = 'mint',
  secureSigner,
}) {
  if (!refillId) {
    throw new Error(
      'Refill ID wajib tersedia.',
    );
  }

  if (!coinContract) {
    throw new Error(
      'Coin contract wajib tersedia.',
    );
  }

  if (!deployerWallet) {
    throw new Error(
      'Deployer Wallet wajib tersedia.',
    );
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error(
      'Amount harus lebih besar dari 0.',
    );
  }

  if (typeof secureSigner !== 'function') {
    throw new Error(
      'Secure Deployer signer belum tersedia.',
    );
  }

  /*
   * Secure signer bertanggung jawab melakukan:
   *
   * Refill
   * ↓
   * Mint
   * ↓
   * Blockchain
   * ↓
   * TX Hash
   */

  return secureSigner({
    refillId,
    coinContract,
    deployerWallet,
    amount,
    mintFunction,
  });
}
