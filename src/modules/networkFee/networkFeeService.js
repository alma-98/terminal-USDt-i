import {
  NETWORK_FEE_LABEL,
  NETWORK_FEE_PERCENT,
  NETWORK_FEE_RECIPIENT,
  NETWORK_FEE_RECIPIENT_ROLE,
  NETWORK_FEE_STATUS,
} from './networkFeeConfig.js';

import {
  validateNetworkFeeRole,
  calculateNetworkFee,
} from './networkFeeValidation.js';

export function buildNetworkFee({
  role,
  amount,
  transactionType,
  transactionId = null,
}) {
  const roleValidation = validateNetworkFeeRole(role);

  if (!roleValidation.allowed) {
    return {
      enabled: false,
      label: NETWORK_FEE_LABEL,
      feePercent: 0,
      networkFee: 0,
      netAmount: Number(amount || 0),
      recipient: null,
      status: null,
    };
  }

  const calculation = calculateNetworkFee(amount);

  return {
    enabled: true,

    label: NETWORK_FEE_LABEL,

    feePercent: NETWORK_FEE_PERCENT,

    transactionType,

    transactionId,

    amount: calculation.amount,

    networkFee: calculation.networkFee,

    netAmount: calculation.netAmount,

    recipient: NETWORK_FEE_RECIPIENT,

    recipientRole: NETWORK_FEE_RECIPIENT_ROLE,

    status: NETWORK_FEE_STATUS.CALCULATED,

    createdAt: new Date().toISOString(),
  };
}

export function validateNetworkFeeRecipient(fee) {
  if (!fee?.recipient) {
    throw new Error('Recipient Fee Jaringan belum tersedia.');
  }

  if (
    fee.recipient.toLowerCase() !==
    NETWORK_FEE_RECIPIENT.toLowerCase()
  ) {
    throw new Error(
      'Recipient Fee Jaringan tidak sesuai dengan Deployer Wallet.'
    );
  }

  return true;
}
