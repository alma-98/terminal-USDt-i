import { getNetworkConfig } from './networkConfig';

export function validateTransactionHash(txHash) {
  if (!txHash) {
    throw new Error('TX hash wajib diisi.');
  }

  if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
    throw new Error('Format TX hash tidak valid.');
  }

  return true;
}

export function validateNetwork(networkId) {
  getNetworkConfig(networkId);
  return true;
}

export function validateNetworkConsistency({
  coinNetwork,
  providerNetwork,
  walletNetwork,
  transactionNetwork,
}) {
  const networks = [
    coinNetwork,
    providerNetwork,
    walletNetwork,
    transactionNetwork,
  ];

  if (networks.some((network) => !network)) {
    return {
      valid: false,
      reason: 'Semua network harus tersedia.',
    };
  }

  const valid = networks.every(
    (network) => network === transactionNetwork,
  );

  return {
    valid,
    reason: valid
      ? 'Network compatible.'
      : 'Coin Network = Provider Network = Wallet Network = Transaction Network harus sama.',
  };
}
