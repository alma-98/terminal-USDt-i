const BURN_REQUESTS_COLLECTION = 'burn_requests';

const STATUS = Object.freeze({
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
});

function assertRole(role, allowed) {
  if (!allowed.includes(role)) {
    const error = new Error('FORBIDDEN');
    error.code = 'FORBIDDEN';
    throw error;
  }
}

function validateRequest(data) {
  if (!data?.coinId) throw new Error('coinId wajib diisi');
  if (!data?.walletAddress) throw new Error('walletAddress wajib diisi');

  const amount = Number(data.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('amount tidak valid');
  }

  if (!data?.reason?.trim()) {
    throw new Error('reason wajib diisi');
  }
}

export function createBurnRequest(data, actor) {
  assertRole(actor?.role, ['Admin', 'Super Admin']);
  validateRequest(data);

  return {
    ...data,
    amount: Number(data.amount),
    status: STATUS.PENDING,
    requestedBy: actor.userId || null,
    requestedByRole: actor.role,
    requestedAt: new Date().toISOString(),
    txHash: null,
    explorerUrl: null,
  };
}

export function approveBurnRequest(request, actor) {
  assertRole(actor?.role, ['Super Admin']);

  if (request?.status !== STATUS.PENDING) {
    throw new Error('Burn Request harus PENDING');
  }

  return {
    ...request,
    status: STATUS.APPROVED,
    approvedBy: actor.userId || null,
    approvedAt: new Date().toISOString(),
  };
}

export function rejectBurnRequest(request, actor, reason) {
  assertRole(actor?.role, ['Super Admin']);

  if (request?.status !== STATUS.PENDING) {
    throw new Error('Burn Request harus PENDING');
  }

  if (!reason?.trim()) {
    throw new Error('Alasan reject wajib diisi');
  }

  return {
    ...request,
    status: STATUS.REJECTED,
    rejectedBy: actor.userId || null,
    rejectedAt: new Date().toISOString(),
    rejectionReason: reason.trim(),
  };
}

export function processApprovedBurn(request, actor) {
  assertRole(actor?.role, ['Super Admin']);

  if (request?.status !== STATUS.APPROVED) {
    throw new Error('Burn Request harus APPROVED');
  }

  return {
    ...request,
    status: STATUS.PROCESSING,
    processingBy: actor.userId || null,
    processingAt: new Date().toISOString(),
  };
}

export function getBurnCollectionName() {
  return BURN_REQUESTS_COLLECTION;
}

export { STATUS };
