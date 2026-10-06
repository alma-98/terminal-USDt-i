const NETWORK_ENV_KEYS = Object.freeze({
  ethereum: {
    alchemy: 'ALCHEMY_ETHEREUM_RPC_URL',
    infura: 'INFURA_ETHEREUM_RPC_URL',
    default: 'DEFAULT_ETHEREUM_RPC_URL'
  },

  ethereum_sepolia: {
    alchemy: 'ALCHEMY_ETHEREUM_SEPOLIA_RPC_URL',
    infura: 'INFURA_ETHEREUM_SEPOLIA_RPC_URL',
    default: 'DEFAULT_ETHEREUM_SEPOLIA_RPC_URL'
  },

  polygon: {
    alchemy: 'ALCHEMY_POLYGON_RPC_URL',
    infura: 'INFURA_POLYGON_RPC_URL',
    default: 'DEFAULT_POLYGON_RPC_URL'
  },

  polygon_amoy: {
    alchemy: 'ALCHEMY_POLYGON_AMOY_RPC_URL',
    infura: 'INFURA_POLYGON_AMOY_RPC_URL',
    default: 'DEFAULT_POLYGON_AMOY_RPC_URL'
  },

  arbitrum: {
    alchemy: 'ALCHEMY_ARBITRUM_RPC_URL',
    infura: 'INFURA_ARBITRUM_RPC_URL',
    default: 'DEFAULT_ARBITRUM_RPC_URL'
  },

  arbitrum_sepolia: {
    alchemy: 'ALCHEMY_ARBITRUM_SEPOLIA_RPC_URL',
    infura: 'INFURA_ARBITRUM_SEPOLIA_RPC_URL',
    default: 'DEFAULT_ARBITRUM_SEPOLIA_RPC_URL'
  },

  base: {
    alchemy: 'ALCHEMY_BASE_RPC_URL',
    infura: 'INFURA_BASE_RPC_URL',
    default: 'DEFAULT_BASE_RPC_URL'
  },

  base_sepolia: {
    alchemy: 'ALCHEMY_BASE_SEPOLIA_RPC_URL',
    infura: 'INFURA_BASE_SEPOLIA_RPC_URL',
    default: 'DEFAULT_BASE_SEPOLIA_RPC_URL'
  }
});

const CHAIN_IDS = Object.freeze({
  ethereum: 1,
  ethereum_sepolia: 11155111,
  polygon: 137,
  polygon_amoy: 80002,
  arbitrum: 42161,
  arbitrum_sepolia: 421614,
  base: 8453,
  base_sepolia: 84532
});

export function getProviderConfig(provider, network) {
  const normalizedProvider = String(provider || '').toLowerCase();
  const normalizedNetwork = String(network || '').toLowerCase();

  const networkConfig = NETWORK_ENV_KEYS[normalizedNetwork];

  if (!networkConfig) {
    throw new Error(`Network tidak didukung: ${network}`);
  }

  if (normalizedProvider === 'custom') {
    return {
      provider: 'custom',
      network: normalizedNetwork,
      chainId: CHAIN_IDS[normalizedNetwork] || null,
      rpcUrl: null
    };
  }

  const envKey = networkConfig[normalizedProvider];

  if (!envKey) {
    throw new Error(
      `Provider ${provider} tidak tersedia untuk network ${network}.`
    );
  }

  return {
    provider: normalizedProvider,
    network: normalizedNetwork,
    chainId: CHAIN_IDS[normalizedNetwork] || null,
    envKey,
    configured: Boolean(process.env[envKey])
  };
}

export function getSupportedProviderTypes() {
  return [
    'alchemy',
    'infura',
    'default',
    'custom'
  ];
}

export function getSupportedNetworks() {
  return Object.keys(NETWORK_ENV_KEYS);
}
