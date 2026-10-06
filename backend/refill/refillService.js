export function validateSuperAdminRefill({
  role,
}) {
  if (role !== 'Super Admin') {
    throw new Error(
      'Refill hanya dapat dilakukan oleh Super Admin.',
    );
  }

  return true;
}

export function createLifetimeRefillPayload({
  coinId,
  amount,
  deployerWalletId,
  user,
}) {
  if (!coinId) {
    throw new Error(
      'Coin wajib tersedia.',
    );
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error(
      'Amount harus lebih besar dari 0.',
    );
  }

  if (!deployerWalletId) {
    throw new Error(
      'Deployer Wallet wajib tersedia.',
    );
  }

  return {
    coinId,
    amount: String(amount),
    deployerWalletId,

    lifetime: true,

    tenorId: null,
    expiresAt: null,

    createdBy: user || null,
    createdAt: new Date().toISOString(),

    txHash: null,
    explorerUrl: null,
  };
}
