export const SWAP_PAIR_COLLECTION = 'swap_pairs';

export const SWAP_PAIR_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
});

export const SWAP_PAIR_DEX = Object.freeze({
  PANCAKESWAP: 'PancakeSwap',
});

export const SUPPORTED_DEX = Object.freeze([
  SWAP_PAIR_DEX.PANCAKESWAP,
]);
