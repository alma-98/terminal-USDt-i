function normalizeRole(role) {
  return String(role || '').trim().toUpperCase();
}

export function isSuperAdmin(role) {
  return normalizeRole(role) === 'SUPER_ADMIN';
}

export function sanitizeNetworkFeeForRole(fee, role) {
  if (!fee) return null;

  const base = {
    id: fee.id,
    label: 'Fee Jaringan',
    feePercent: fee.feePercent,
    amount: fee.amount,
    networkFee: fee.networkFee,
    netAmount: fee.netAmount,
    transactionType: fee.transactionType,
    transactionId: fee.transactionId,
    status: fee.status,
    createdAt: fee.createdAt,
  };

  /*
   * Recipient hanya ditambahkan untuk SUPER_ADMIN.
   */
  if (isSuperAdmin(role)) {
    return {
      ...base,
      recipient: fee.recipient,
      recipientRole: fee.recipientRole,
    };
  }

  return base;
}
