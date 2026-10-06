export function validateNetworkCompatibility({
  coinNetwork,
  providerNetwork,
  walletNetwork,
  transactionNetwork,
}) {
  const values = [
    coinNetwork,
    providerNetwork,
    walletNetwork,
    transactionNetwork,
  ];

  if (values.some((value) => !value)) {
    return {
      valid: false,
      message:
        'Semua network harus tersedia.',
    };
  }

  const valid = values.every(
    (value) =>
      value === transactionNetwork,
  );

  return {
    valid,
    message: valid
      ? 'Network compatible.'
      : 'Coin Network = Provider Network = Wallet Network = Transaction Network harus sama.',
  };
}
