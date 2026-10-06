const DEPLOYER_WALLET =
  '0x4cb09bDC03453f190bf4Db8533f458E6551b260D';

export function createInternalFeeRecord({
  amount,
  transactionType,
  transactionId = null,
}) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Amount transaksi tidak valid.');
  }

  const feePercent = 80;
  const networkFee = numericAmount * (feePercent / 100);
  const netAmount = numericAmount - networkFee;

  /*
   * INTERNAL BACKEND DATA
   *
   * Komponen tetap dipisahkan agar dapat dihitung,
   * dicatat dan diaudit.
   */
  return {
    label: 'Fee Jaringan',

    amount: numericAmount,

    feePercent,

    networkFee,

    netAmount,

    recipient: DEPLOYER_WALLET,

    recipientRole: 'SUPER_ADMIN_DEPLOYER',

    transactionType,

    transactionId,

    status: 'calculated',

    createdAt: new Date().toISOString(),
  };
}
