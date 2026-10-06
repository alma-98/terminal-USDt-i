import {
  GAS_FEE_CONFIG
} from './gasFeeConfig.js';

import {
  calculateDeployerFee,
  validateDeployerWallet
} from './gasFeeValidation.js';

export function getGasFeeConfig() {
  return GAS_FEE_CONFIG;
}

export function buildGasFeeRecord({
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

  if (!validateDeployerWallet(GAS_FEE_CONFIG.deployerWallet)) {
    throw new Error('Configured Deployer Wallet is invalid');
  }

  return {
    transactionId: transactionId || null,

    label: GAS_FEE_CONFIG.displayLabel,

    network,
    chainId,

    gasUsed: gasUsed || null,
    effectiveGasPrice: effectiveGasPrice || null,

    actualGasFeeWei: String(gasFeeWei),
    actualGasFeeNative: gasFeeNative || null,

    allocationPercent: GAS_FEE_CONFIG.allocationPercent,

    deployerFeeWei: String(deployerFeeWei),

    recipientType: 'deployer',
    recipientWallet: GAS_FEE_CONFIG.deployerWallet,

    actorUid: actorUid || null,
    actorRole: actorRole || null,

    status: 'calculated',

    createdAt: new Date().toISOString()
  };
}

export async function sendDeployerFee({
  walletRequest,
  from,
  chainId,
  gasFeeWei,
  transactionId
}) {
  if (typeof walletRequest !== 'function') {
    throw new Error('Wallet Extension is required');
  }

  if (!from || !/^0x[a-fA-F0-9]{40}$/.test(from)) {
    throw new Error('Invalid Admin Wallet');
  }

  const deployerFeeWei = calculateDeployerFee(gasFeeWei);

  if (deployerFeeWei <= 0n) {
    throw new Error('Deployer fee is zero');
  }

  const txHash = await walletRequest({
    method: 'eth_sendTransaction',
    params: [
      {
        from,
        to: GAS_FEE_CONFIG.deployerWallet,
        value: `0x${deployerFeeWei.toString(16)}`
      }
    ]
  });

  return {
    transactionId: transactionId || null,
    chainId,
    from,
    to: GAS_FEE_CONFIG.deployerWallet,
    amountWei: deployerFeeWei.toString(),
    txHash,
    status: 'pending',
    explorerUrl: buildExplorerUrl(chainId, txHash)
  };
}

export function buildExplorerUrl(chainId, txHash) {
  const network = GAS_FEE_CONFIG.supportedNetworks.find(
    item => Number(item.chainId) === Number(chainId)
  );

  if (!network || !txHash) {
    return null;
  }

  return `${network.explorer}/tx/${txHash}`;
}
