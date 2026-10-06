export const NETWORKS = Object.freeze({
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum Mainnet',
    chainId: 1,
    nativeCurrency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    active: true,
    isDefault: true
  },

  ethereum_sepolia: {
    id: 'ethereum_sepolia',
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    nativeCurrency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    active: true,
    isDefault: false
  },

  polygon: {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    nativeCurrency: 'POL',
    explorerUrl: 'https://polygonscan.com',
    active: true,
    isDefault: false
  },

  polygon_amoy: {
    id: 'polygon_amoy',
    name: 'Polygon Amoy',
    chainId: 80002,
    nativeCurrency: 'POL',
    explorerUrl: 'https://amoy.polygonscan.com',
    active: true,
    isDefault: false
  },

  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum One',
    chainId: 42161,
    nativeCurrency: 'ETH',
    explorerUrl: 'https://arbiscan.io',
    active: true,
    isDefault: false
  },

  arbitrum_sepolia: {
    id: 'arbitrum_sepolia',
    name: 'Arbitrum Sepolia',
    chainId: 421614,
    nativeCurrency: 'ETH',
    explorerUrl: 'https://sepolia.arbiscan.io',
    active: true,
    isDefault: false
  },

  base: {
    id: 'base',
    name: 'Base',
    chainId: 8453,
    nativeCurrency: 'ETH',
    explorerUrl: 'https://basescan.org',
    active: true,
    isDefault: false
  },

  base_sepolia: {
    id: 'base_sepolia',
    name: 'Base Sepolia',
    chainId: 84532,
    nativeCurrency: 'ETH',
    explorerUrl: 'https://sepolia.basescan.org',
    active: true,
    isDefault: false
  }
});

export const DEFAULT_NETWORK_ID = 'ethereum';

export function getNetwork(networkId) {
  return NETWORKS[String(networkId || '').trim()];
}

export function getNetworkByChainId(chainId) {
  const numericChainId = Number(chainId);

  return Object.values(NETWORKS).find(
    (network) => network.chainId === numericChainId
  ) || null;
}

export function getSupportedNetworks() {
  return Object.values(NETWORKS);
}
