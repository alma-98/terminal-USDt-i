import {
  getExplorerTransactionUrl,
  getNetworkConfig,
} from './networkConfig';

import {
  validateNetwork,
  validateTransactionHash,
} from './verificationValidation';

export function createExplorerReference({
  txHash,
  networkId,
}) {
  validateTransactionHash(txHash);
  validateNetwork(networkId);

  const network = getNetworkConfig(networkId);

  return {
    network: network.name,
    chainId: network.chainId,
    explorer: network.explorerName,
    url: getExplorerTransactionUrl(
      networkId,
      txHash,
    ),
  };
}

/*
 * Verification menggunakan provider/backend yang tersedia.
 * Tidak menghapus transaksi on-chain.
 */
export async function verifyTransaction({
  txHash,
  networkId,
  providerVerifier,
}) {
  validateTransactionHash(txHash);
  validateNetwork(networkId);

  const explorerReference =
    createExplorerReference({
      txHash,
      networkId,
    });

  if (!providerVerifier) {
    return {
      status: 'UNVERIFIED',
      confirmations: 0,
      explorerReference,
      message:
        'Provider verifier belum tersedia.',
    };
  }

  const result =
    await providerVerifier({
      txHash,
      networkId,
    });

  return {
    status: result?.status || 'UNKNOWN',
    confirmations:
      result?.confirmations || 0,
    blockNumber:
      result?.blockNumber || null,
    receiptStatus:
      result?.receiptStatus ?? null,
    explorerReference,
    message:
      result?.message ||
      'Transaction verification selesai.',
  };
}

export async function retryVerification({
  txHash,
  networkId,
  providerVerifier,
  attempts = 3,
  delayMs = 1500,
}) {
  let lastResult = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    lastResult = await verifyTransaction({
      txHash,
      networkId,
      providerVerifier,
    });

    if (
      lastResult.status === 'CONFIRMED' ||
      lastResult.status === 'FAILED'
    ) {
      return {
        ...lastResult,
        attempt,
      };
    }

    if (attempt < attempts) {
      await new Promise((resolve) =>
        setTimeout(resolve, delayMs),
      );
    }
  }

  return {
    ...lastResult,
    attempt: attempts,
  };
}
