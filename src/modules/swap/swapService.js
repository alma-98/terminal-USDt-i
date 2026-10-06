import {
  SWAP_DEX,
  SWAP_STATUS,
  SWAP_ALLOCATION_STATUS,
} from './swapConfig.js';
import {
  validateAllocationForSwap,
  validateSwapInput,
} from './swapValidation.js';

export function buildSwapDraft({
  networkId,
  pair,
  amount,
  walletAddress,
  allocation,
}) {
  validateSwapInput({
    networkId,
    dex: SWAP_DEX,
    pair,
    amount,
    walletAddress,
    allocation,
  });

  return {
    dex: SWAP_DEX,
    networkId,
    pair,
    amount: String(amount),
    walletAddress,
    allocationId: allocation.id || null,
    allocationStatus:
      allocation.expiryStatus || allocation.status ||
      SWAP_ALLOCATION_STATUS.ACTIVE,
    status: SWAP_STATUS.DRAFT,
  };
}

export function validateSwapBeforeBlockchain(swap, allocation) {
  const allocationResult = validateAllocationForSwap(allocation);

  if (!allocationResult.allowed) {
    throw new Error(allocationResult.message);
  }

  if (swap?.allocationStatus === SWAP_ALLOCATION_STATUS.EXPIRED) {
    throw new Error(
      'Allocation EXPIRED. Swap diblokir sebelum transaksi blockchain.'
    );
  }

  if (swap?.allocationStatus === SWAP_ALLOCATION_STATUS.REVOKED) {
    throw new Error(
      'Allocation REVOKED. Swap diblokir sebelum transaksi blockchain.'
    );
  }

  return true;
}

export function createSwapRecord({
  draft,
  quote,
  transactionHash = null,
}) {
  return {
    ...draft,
    quote: quote || null,
    transactionHash,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: transactionHash
      ? SWAP_STATUS.PENDING
      : SWAP_STATUS.QUOTED,
  };
}
