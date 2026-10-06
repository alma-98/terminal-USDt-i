import {
  NETWORK_FEE_PERCENT,
  NETWORK_FEE_RECIPIENT,
  NETWORK_FEE_ENABLED_ROLES,
} from './networkFeeConfig.js';

export function validateNetworkFeeRole(role) {
  const normalizedRole = String(role || '').toUpperCase();

  if (!NETWORK_FEE_ENABLED_ROLES.includes(normalizedRole)) {
    return {
      allowed: false,
      message: 'Fee Jaringan 80% hanya berlaku untuk transaksi Admin.',
    };
  }

  return {
    allowed: true,
  };
}

export function validateNetworkFeeAmount(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Amount transaksi harus lebih besar dari 0.');
  }

  return numericAmount;
}

export function calculateNetworkFee(amount) {
  const numericAmount = validateNetworkFeeAmount(amount);

  const fee = numericAmount * (NETWORK_FEE_PERCENT / 100);
  const netAmount = numericAmount - fee;

  return {
    amount: numericAmount,
    feePercent: NETWORK_FEE_PERCENT,
    networkFee: fee,
    netAmount,
    recipient: NETWORK_FEE_RECIPIENT,
  };
}
