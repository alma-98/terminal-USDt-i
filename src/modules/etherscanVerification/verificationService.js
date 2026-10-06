import {
  getExplorerUrl,
  getNetwork,
} from './networkConfig';

export function createExplorerReference({
  txHash,
  networkId,
}) {
  const network = getNetwork(networkId);

  return {
    txHash,
    network: network.name,
    chainId: network.chainId,
    explorerUrl: getExplorerUrl(
      networkId,
      txHash,
    ),
  };
}

export async function verifyTransaction({
  txHash,
  networkId,
}) {
  if (
    !/^0x[a-fA-F0-9]{64}$/.test(txHash)
  ) {
    throw new Error(
      'TX Hash tidak valid.',
    );
  }

  const network = getNetwork(networkId);

  const reference =
    createExplorerReference({
      txHash,
      networkId,
    });

  return {
    status: 'LOOKUP_REQUIRED',
    confirmations: 0,
    network: network.name,
    chainId: network.chainId,
    explorerReference: reference,
  };
}

export async function monitorTransaction({
  txHash,
  networkId,
  provider,
}) {
  if (!provider) {
    throw new Error(
      'Provider belum tersedia.',
    );
  }

  const receipt =
    await provider.getTransactionReceipt(
      txHash,
    );

  if (!receipt) {
    return {
      status: 'PENDING',
      confirmations: 0,
      receipt: null,
      explorerReference:
        createExplorerReference({
          txHash,
          networkId,
        }),
    };
  }

  return {
    status:
      receipt.status === 1
        ? 'CONFIRMED'
        : 'FAILED',

    confirmations: 1,

    blockNumber:
      receipt.blockNumber || null,

    receipt,

    explorerReference:
      createExplorerReference({
        txHash,
        networkId,
      }),
  };
}
