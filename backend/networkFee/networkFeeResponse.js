function normalizeRole(role) {
  return String(role || '').trim().toUpperCase();
}

/*
 * ADMIN RESPONSE
 *
 * Hanya satu item:
 *
 * Fee Jaringan
 * 80%
 *
 * Tidak mengirim recipient internal.
 * Tidak mengirim field feePercent/networkFee secara terpisah.
 */
export function buildAdminFeeResponse(record) {
  if (!record) return null;

  return {
    label: 'Fee Jaringan',
    value: `${record.feePercent}%`,
  };
}

/*
 * SUPER ADMIN RESPONSE
 *
 * Super Admin dapat melihat data internal.
 */
export function buildSuperAdminFeeResponse(record) {
  if (!record) return null;

  return {
    label: 'Fee Jaringan',
    value: `${record.feePercent}%`,

    amount: record.amount,
    feePercent: record.feePercent,
    networkFee: record.networkFee,
    netAmount: record.netAmount,

    recipient: record.recipient,
    recipientRole: record.recipientRole,

    transactionType: record.transactionType,
    transactionId: record.transactionId,
    status: record.status,
    createdAt: record.createdAt,
  };
}

export function buildFeeResponse(record, role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'SUPER_ADMIN') {
    return buildSuperAdminFeeResponse(record);
  }

  if (normalizedRole === 'ADMIN') {
    return buildAdminFeeResponse(record);
  }

  throw new Error('Unauthorized fee response.');
}
