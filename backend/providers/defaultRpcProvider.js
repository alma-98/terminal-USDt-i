const DEFAULT_NETWORKS = {
  ethereum: {
    chainId: 1,
    envKey: "DEFAULT_ETHEREUM_RPC_URL"
  },

  ethereum_sepolia: {
    chainId: 11155111,
    envKey: "DEFAULT_ETHEREUM_SEPOLIA_RPC_URL"
  },

  polygon: {
    chainId: 137,
    envKey: "DEFAULT_POLYGON_RPC_URL"
  },

  polygon_amoy: {
    chainId: 80002,
    envKey: "DEFAULT_POLYGON_AMOY_RPC_URL"
  },

  arbitrum: {
    chainId: 42161,
    envKey: "DEFAULT_ARBITRUM_RPC_URL"
  },

  arbitrum_sepolia: {
    chainId: 421614,
    envKey: "DEFAULT_ARBITRUM_SEPOLIA_RPC_URL"
  },

  base: {
    chainId: 8453,
    envKey: "DEFAULT_BASE_RPC_URL"
  },

  base_sepolia: {
    chainId: 84532,
    envKey: "DEFAULT_BASE_SEPOLIA_RPC_URL"
  }
};

export function getDefaultRpcConfig(
  networkId
) {
  const config =
    DEFAULT_NETWORKS[networkId];

  if (!config) {
    throw new Error(
      `Default RPC tidak tersedia untuk network: ${networkId}`
    );
  }

  const rpcUrl =
    process.env[config.envKey];

  if (!rpcUrl) {
    throw new Error(
      `Default RPC belum dikonfigurasi untuk ${networkId}.`
    );
  }

  return {
    provider: "default",
    networkId,
    chainId:
      config.chainId,
    rpcUrl
  };
}

export function getDefaultRpcUrl(
  networkId
) {
  return getDefaultRpcConfig(
    networkId
  ).rpcUrl;
}

export function getDefaultNetworks() {
  return Object.entries(
    DEFAULT_NETWORKS
  ).map(
    ([networkId, config]) => ({
      networkId,
      chainId:
        config.chainId
    })
  );
}
