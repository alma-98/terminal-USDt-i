export function buildNetworkFeeView({
  role,
  fee,
}) {
  if (!fee) return null;

  const normalizedRole =
    String(role || '').trim().toUpperCase();

  /*
   * ADMIN
   *
   * Satu tampilan saja:
   * Fee Jaringan 80%
   *
   * Tidak ada recipient.
   * Tidak ada field internal terpisah.
   */
  if (normalizedRole === 'ADMIN') {
    return {
      label: 'Fee Jaringan',
      value: `${fee.feePercent}%`,
    };
  }

  /*
   * SUPER ADMIN
   *
   * Internal information tetap tersedia.
   */
  if (normalizedRole === 'SUPER_ADMIN') {
    return {
      label: 'Fee Jaringan',
      value: `${fee.feePercent}%`,

      amount: fee.amount,
      feePercent: fee.feePercent,
      networkFee: fee.networkFee,
      netAmount: fee.netAmount,

      recipient: fee.recipient,
      recipientRole: fee.recipientRole,

      transactionType: fee.transactionType,
      transactionId: fee.transactionId,
      status: fee.status,
    };
  }

  return null;
}
