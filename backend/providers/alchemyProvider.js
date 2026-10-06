const NETWORKS = {
  ethereum: {
    chainId: 1,
    envKey: "ALCHEMY_ETHEREUM_RPC_URL"
  },

  ethereum_sepolia: {
    chainId: 11155111,
    envKey: "ALCHEMY_ETHEREUM_SEPOLIA_RPC_URL"
  },

  polygon: {
    chainId: 137,
    envKey: "ALCHEMY_POLYGON_RPC_URL"
  },

  polygon_amoy: {
    chainId: 80002,
    envKey: "ALCHEMY_POLYGON_AMOY_RPC_URL"
  },

  arbitrum: {
    chainId: 42161,
    envKey: "ALCHEMY_ARBITRUM_RPC_URL"
  },

  arbitrum_sepolia: {
    chainId: 421614,
    envKey: "ALCHEMY_ARBITRUM_SEPOLIA_RPC_URL"
  },

  base: {
    chainId: 8453,
    envKey: "ALCHEMY_BASE_RPC_URL"
  },

  base_sepolia: {
    chainId: 84532,
    envKey: "ALCHEMY_BASE_SEPOLIA_RPC_URL"
  }
};

export function getSupportedNetworks() {
  return Object.entries(NETWORKS).map(
    ([networkId, config]) => ({
      networkId,
      chainId: config.chainId
    })
  );
}

export function getAlchemyConfig(networkId) {
  const config = NETWORKS[networkId];

  if (!config) {
    throw new Error(
      `Network Alchemy tidak didukung: ${networkId}`
    );
  }

  const rpcUrl = process.env[config.envKey];

  if (!rpcUrl) {
    throw new Error(
      `RPC URL belum dikonfigurasi untuk ${networkId}.`
    );
  }

  return {
    networkId,
    chainId: config.chainId,
    rpcUrl
  };
}

export function getAlchemyRpcUrl(networkId) {
  return getAlchemyConfig(networkId).rpcUrl;
}
