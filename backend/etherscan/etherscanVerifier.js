const NETWORK_CONFIG = {
  ethereum: {
    chainId: 1,
    apiChainId: 1,
  },

  sepolia: {
    chainId: 11155111,
    apiChainId: 11155111,
  },

  polygon: {
    chainId: 137,
    apiChainId: 137,
  },

  polygonAmoy: {
    chainId: 80002,
    apiChainId: 80002,
  },

  arbitrum: {
    chainId: 42161,
    apiChainId: 42161,
  },

  arbitrumSepolia: {
    chainId: 421614,
    apiChainId: 421614,
  },

  base: {
    chainId: 8453,
    apiChainId: 8453,
  },

  baseSepolia: {
    chainId: 84532,
    apiChainId: 84532,
  },
};

function getApiKey() {
  return (
    process.env.ETHERSCAN_API_KEY ||
    ''
  );
}

export async function verifyTransactionWithEtherscan({
  txHash,
  networkId,
}) {
  const network =
    NETWORK_CONFIG[networkId];

  if (!network) {
    throw new Error(
      `Network tidak didukung: ${networkId}`,
    );
  }

  if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
    throw new Error(
      'Format TX hash tidak valid.',
    );
  }

  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      status: 'UNVERIFIED',
      confirmations: 0,
      blockNumber: null,
      receiptStatus: null,
      message:
        'ETHERSCAN_API_KEY belum dikonfigurasi server-side.',
    };
  }

  const url =
    `https://api.etherscan.io/v2/api` +
    `?chainid=${network.apiChainId}` +
    `&module=proxy` +
    `&action=eth_getTransactionByHash` +
    `&txhash=${encodeURIComponent(txHash)}` +
    `&apikey=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Etherscan HTTP ${response.status}`,
    );
  }

  const data = await response.json();

  if (!data.result) {
    return {
      status: 'NOT_FOUND',
      confirmations: 0,
      blockNumber: null,
      receiptStatus: null,
      message: 'Transaction belum ditemukan.',
    };
  }

  const transaction = data.result;

  const blockNumber =
    transaction.blockNumber || null;

  if (!blockNumber || blockNumber === '0x') {
    return {
      status: 'PENDING',
      confirmations: 0,
      blockNumber: null,
      receiptStatus: null,
      message: 'Transaction masih pending.',
    };
  }

  return {
    status: 'CONFIRMED',
    confirmations: 1,
    blockNumber,
    receiptStatus: null,
    message: 'Transaction ditemukan di blockchain.',
  };
}
