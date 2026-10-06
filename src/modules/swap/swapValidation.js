import { SWAP_ALLOCATION_STATUS, SWAP_DEX } from './swapConfig.js';

export function normalizeAllocationStatus(status) {
  return String(status || '').trim().toLowerCase();
}

export function isAllocationActive(allocation) {
  if (!allocation) return false;

  const status = normalizeAllocationStatus(allocation.expiryStatus || allocation.status);

  if (status === SWAP_ALLOCATION_STATUS.EXPIRED) return false;
  if (status === SWAP_ALLOCATION_STATUS.REVOKED) return false;

  return status === SWAP_ALLOCATION_STATUS.ACTIVE;
}

export function validateAllocationForSwap(allocation) {
  if (!allocation) {
    return {
      allowed: false,
      code: 'ALLOCATION_NOT_FOUND',
      message: 'Allocation tidak ditemukan.',
    };
  }

  const status = normalizeAllocationStatus(
    allocation.expiryStatus || allocation.status
  );

  if (status === SWAP_ALLOCATION_STATUS.EXPIRED) {
    return {
      allowed: false,
      code: 'ALLOCATION_EXPIRED',
      message: 'Allocation sudah EXPIRED dan tidak dapat digunakan untuk Swap.',
    };
  }

  if (status === SWAP_ALLOCATION_STATUS.REVOKED) {
    return {
      allowed: false,
      code: 'ALLOCATION_REVOKED',
      message: 'Allocation sudah REVOKED dan tidak dapat digunakan untuk Swap.',
    };
  }

  if (status !== SWAP_ALLOCATION_STATUS.ACTIVE) {
    return {
      allowed: false,
      code: 'ALLOCATION_NOT_ACTIVE',
      message: 'Allocation harus berstatus ACTIVE untuk melakukan Swap.',
    };
  }

  return {
    allowed: true,
    code: 'ALLOCATION_ACTIVE',
    message: 'Allocation ACTIVE dan dapat digunakan.',
  };
}

export function validateSwapInput({
  networkId,
  dex,
  pair,
  amount,
  walletAddress,
  allocation,
}) {
  if (!networkId) {
    throw new Error('Network wajib dipilih.');
  }

  if (dex !== SWAP_DEX) {
    throw new Error('DEX yang didukung pada tahap ini adalah PancakeSwap.');
  }

  if (!pair) {
    throw new Error('Token Pair wajib dipilih.');
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error('Amount harus lebih besar dari 0.');
  }

  if (!walletAddress) {
    throw new Error('Wallet wajib dipilih.');
  }

  const allocationResult = validateAllocationForSwap(allocation);

  if (!allocationResult.allowed) {
    throw new Error(allocationResult.message);
  }

  return true;
}

/*
 * Swap Pair Management integration:
 * hanya Pair ACTIVE yang boleh digunakan Swap.
 */
export function validateSwapPairAvailability(pair) {
  if (!pair) {
    throw new Error(
      'Swap Pair/Pool belum tersedia.'
    );
  }

  if (pair.status !== 'active') {
    throw new Error(
      'Swap Pair INACTIVE tidak dapat digunakan.'
    );
  }

  return true;
}
