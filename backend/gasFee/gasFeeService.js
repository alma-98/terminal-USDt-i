const DEPLOYER_WALLET =
  '0x4cb09bDC03453f190bf4Db8533f458E6551b260D';

const GAS_FEE_ALLOCATION_PERCENT = 50;

function calculateDeployerFee(gasFeeWei) {
  const fee = BigInt(gasFeeWei);

  return (
    fee * BigInt(GAS_FEE_ALLOCATION_PERCENT)
  ) / 100n;
}

function createGasFeeRecord({
  transactionId,
  network,
  chainId,
  gasUsed,
  effectiveGasPrice,
  gasFeeWei,
  gasFeeNative,
  actorUid,
  actorRole
}) {
  const deployerFeeWei = calculateDeployerFee(gasFeeWei);

  return {
    transactionId: transactionId || null,
    label: 'Gas Fee Mainnet From Blockchain',

    network,
    chainId,

    gasUsed: gasUsed || null,
    effectiveGasPrice: effectiveGasPrice || null,

    actualGasFeeWei: String(gasFeeWei),
    actualGasFeeNative: gasFeeNative || null,

    allocationPercent: GAS_FEE_ALLOCATION_PERCENT,

    deployerFeeWei: deployerFeeWei.toString(),

    recipientType: 'deployer',
    recipientWallet: DEPLOYER_WALLET,

    actorUid: actorUid || null,
    actorRole: actorRole || null,

    status: 'calculated',

    createdAt: new Date().toISOString()
  };
}

module.exports = {
  DEPLOYER_WALLET,
  GAS_FEE_ALLOCATION_PERCENT,
  calculateDeployerFee,
  createGasFeeRecord
};
