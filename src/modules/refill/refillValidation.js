export function validateRefillInput({
  role,
  coinId,
  amount,
  deployerWalletId,
}) {
  const errors = {};

  if (role !== 'Super Admin') {
    errors.role =
      'Refill hanya dapat dilakukan oleh Super Admin.';
  }

  if (!coinId) {
    errors.coinId = 'Coin wajib dipilih.';
  }

  if (!amount || Number(amount) <= 0) {
    errors.amount =
      'Amount harus lebih besar dari 0.';
  }

  if (!deployerWalletId) {
    errors.deployerWalletId =
      'Active Deployer Wallet wajib dipilih.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLifetimeRefill({
  expiresAt,
  tenorId,
}) {
  if (expiresAt !== null) {
    throw new Error(
      'Refill harus bersifat LIFETIME dan tidak memiliki expiry.',
    );
  }

  if (tenorId !== null) {
    throw new Error(
      'Refill tidak menggunakan Tenor Transfer.',
    );
  }

  return true;
}
