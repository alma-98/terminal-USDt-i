export const NETWORKS = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum Mainnet',
    chainId: 1,
    explorer:
      'https://etherscan.io',
  },

  sepolia: {
    id: 'sepolia',
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    explorer:
      'https://sepolia.etherscan.io',
  },

  polygon: {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    explorer:
      'https://polygonscan.com',
  },

  polygonAmoy: {
    id: 'polygonAmoy',
    name: 'Polygon Amoy',
    chainId: 80002,
    explorer:
      'https://amoy.polygonscan.com',
  },

  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum',
    chainId: 42161,
    explorer:
      'https://arbiscan.io',
  },

  arbitrumSepolia: {
    id: 'arbitrumSepolia',
    name: 'Arbitrum Sepolia',
    chainId: 421614,
    explorer:
      'https://sepolia.arbiscan.io',
  },

  base: {
    id: 'base',
    name: 'Base',
    chainId: 8453,
    explorer:
      'https://basescan.org',
  },

  baseSepolia: {
    id: 'baseSepolia',
    name: 'Base Sepolia',
    chainId: 84532,
    explorer:
      'https://sepolia.basescan.org',
  },
};

export function getNetwork(networkId) {
  const network = NETWORKS[networkId];

  if (!network) {
    throw new Error(
      `Network tidak didukung: ${networkId}`,
    );
  }

  return network;
}

export function getExplorerUrl(
  networkId,
  txHash,
) {
  const network = getNetwork(networkId);

  if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
    throw new Error(
      'TX Hash tidak valid.',
    );
  }

  return `${network.explorer}/tx/${txHash}`;
}
