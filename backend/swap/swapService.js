const ACTIVE = 'active';
const EXPIRED = 'expired';
const REVOKED = 'revoked';

export function validateSwapAllocation(allocation) {
  if (!allocation) {
    return {
      allowed: false,
      code: 'ALLOCATION_NOT_FOUND',
      message: 'Allocation tidak ditemukan.',
    };
  }

  const status = String(
    allocation.expiryStatus || allocation.status || ''
  ).toLowerCase();

  if (status === EXPIRED) {
    return {
      allowed: false,
      code: 'ALLOCATION_EXPIRED',
      message: 'Allocation EXPIRED. Swap diblokir.',
    };
  }

  if (status === REVOKED) {
    return {
      allowed: false,
      code: 'ALLOCATION_REVOKED',
      message: 'Allocation REVOKED. Swap diblokir.',
    };
  }

  if (status !== ACTIVE) {
    return {
      allowed: false,
      code: 'ALLOCATION_NOT_ACTIVE',
      message: 'Allocation harus ACTIVE untuk Swap.',
    };
  }

  return {
    allowed: true,
    code: 'ALLOCATION_ACTIVE',
    message: 'Allocation ACTIVE.',
  };
}

export function validateSwapRequest(request) {
  if (!request?.networkId) {
    throw new Error('Network wajib tersedia.');
  }

  if (!request?.pairId) {
    throw new Error('Pair/Pool wajib tersedia.');
  }

  if (!request?.amount || Number(request.amount) <= 0) {
    throw new Error('Amount harus lebih besar dari 0.');
  }

  const result = validateSwapAllocation(request.allocation);

  if (!result.allowed) {
    throw new Error(result.message);
  }

  return true;
}
