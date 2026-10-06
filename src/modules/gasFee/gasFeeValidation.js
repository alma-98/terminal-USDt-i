import { GAS_FEE_CONFIG } from './gasFeeConfig.js';

export function isValidGasFee(value) {
  return (
    typeof value === 'bigint' ||
    (typeof value === 'string' && /^\d+$/.test(value))
  );
}

export function calculateDeployerFee(gasFeeWei) {
  if (!isValidGasFee(gasFeeWei)) {
    throw new Error('Invalid blockchain gas fee');
  }

  const fee = BigInt(gasFeeWei);

  return (fee * BigInt(GAS_FEE_CONFIG.allocationPercent)) / 100n;
}

export function validateDeployerWallet(address) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid Deployer Wallet address');
  }

  return address.toLowerCase() ===
    GAS_FEE_CONFIG.deployerWallet.toLowerCase();
}
