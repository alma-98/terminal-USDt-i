export const SWAP_DEX = 'PancakeSwap';

export const SWAP_ALLOCATION_STATUS = Object.freeze({
  ACTIVE: 'active',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
});

export const SWAP_STATUS = Object.freeze({
  DRAFT: 'draft',
  QUOTED: 'quoted',
  REVIEW: 'review',
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
});

export const PANCAKESWAP_ROUTER_METHODS = Object.freeze({
  getAmountsOut: 'getAmountsOut',
  approve: 'approve',
  allowance: 'allowance',
  swapExactTokensForTokens: 'swapExactTokensForTokens',
});
