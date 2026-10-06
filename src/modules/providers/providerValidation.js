const SUPPORTED_PROVIDERS = [
  'alchemy',
  'infura',
  'default',
  'custom'
];

const SUPPORTED_NETWORKS = [
  'ethereum',
  'ethereum_sepolia',
  'polygon',
  'polygon_amoy',
  'arbitrum',
  'arbitrum_sepolia',
  'base',
  'base_sepolia'
];

const CHAIN_IDS = {
  ethereum: 1,
  ethereum_sepolia: 11155111,
  polygon: 137,
  polygon_amoy: 80002,
  arbitrum: 42161,
  arbitrum_sepolia: 421614,
  base: 8453,
  base_sepolia: 84532
};

export function validateProvider(input = {}) {
  const errors = {};

  const type = String(input.type || '').trim().toLowerCase();
  const network = String(input.network || '').trim().toLowerCase();
  const rpcUrl = String(input.rpcUrl || '').trim();
  const chainId = Number(input.chainId || 0);
  const explorerUrl = String(input.explorerUrl || '').trim();
  const status = String(input.status || '').trim().toUpperCase();

  if (!SUPPORTED_PROVIDERS.includes(type)) {
    errors.type = 'Provider harus Alchemy, Infura, Default RPC, atau Custom RPC.';
  }

  if (!SUPPORTED_NETWORKS.includes(network)) {
    errors.network = 'Network tidak didukung.';
  }

  if (type === 'custom' && !rpcUrl) {
    errors.rpcUrl = 'RPC URL wajib diisi untuk Custom RPC.';
  }

  if (type === 'custom') {
    if (!chainId || chainId <= 0) {
      errors.chainId = 'Chain ID wajib diisi untuk Custom RPC.';
    }

    if (!explorerUrl) {
      errors.explorerUrl = 'Explorer URL wajib diisi untuk Custom RPC.';
    }
  }

  if (!['ACTIVE', 'INACTIVE'].includes(status)) {
    errors.status = 'Status harus ACTIVE atau INACTIVE.';
  }

  if (
    network &&
    chainId &&
    CHAIN_IDS[network] &&
    type === 'custom' &&
    CHAIN_IDS[network] !== chainId
  ) {
    errors.chainId =
      `Chain ID ${chainId} tidak cocok dengan network ${network}.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export {
  SUPPORTED_PROVIDERS,
  SUPPORTED_NETWORKS,
  CHAIN_IDS
};
