import {
  BURN_BLOCKCHAIN_MODES,
  BURN_REQUEST_STATUS,
} from './burnConfig.js';
import { validateBurnRequest } from './burnValidation.js';

export function createBurnRequest(input = {}, actor = {}) {
  const validation = validateBurnRequest(input);

  if (!validation.valid) {
    const error = new Error('Burn Request tidak valid');
    error.code = 'VALIDATION_ERROR';
    error.details = validation.errors;
    throw error;
  }

  if (!['Admin', 'Super Admin'].includes(actor.role)) {
    const error = new Error('Role tidak memiliki permission Burn Request');
    error.code = 'FORBIDDEN';
    throw error;
  }

  return {
    ...input,
    status: BURN_REQUEST_STATUS.PENDING,
    requestedBy: actor.userId || null,
    requestedByRole: actor.role,
    requestedAt: new Date().toISOString(),
    blockchainMode:
      input.blockchainMode || BURN_BLOCKCHAIN_MODES.APPLICATION,
    txHash: null,
    explorerUrl: null,
    approvedBy: null,
    approvedAt: null,
    rejectedBy: null,
    rejectedAt: null,
  };
}

export function approveBurnRequest(request, actor = {}) {
  if (actor.role !== 'Super Admin') {
    const error = new Error('Hanya Super Admin yang dapat melakukan Burn Approval');
    error.code = 'FORBIDDEN';
    throw error;
  }

  if (!request || request.status !== BURN_REQUEST_STATUS.PENDING) {
    const error = new Error('Burn Request tidak berstatus PENDING');
    error.code = 'INVALID_STATUS';
    throw error;
  }

  return {
    ...request,
    status: BURN_REQUEST_STATUS.APPROVED,
    approvedBy: actor.userId || null,
    approvedByRole: actor.role,
    approvedAt: new Date().toISOString(),
  };
}

export function rejectBurnRequest(request, actor = {}, reason = '') {
  if (actor.role !== 'Super Admin') {
    const error = new Error('Hanya Super Admin yang dapat Reject Burn Request');
    error.code = 'FORBIDDEN';
    throw error;
  }

  if (!request || request.status !== BURN_REQUEST_STATUS.PENDING) {
    const error = new Error('Burn Request tidak berstatus PENDING');
    error.code = 'INVALID_STATUS';
    throw error;
  }

  if (!String(reason).trim()) {
    const error = new Error('Alasan reject wajib diisi');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  return {
    ...request,
    status: BURN_REQUEST_STATUS.REJECTED,
    rejectedBy: actor.userId || null,
    rejectedByRole: actor.role,
    rejectedAt: new Date().toISOString(),
    rejectionReason: String(reason).trim(),
  };
}

export function prepareApprovedBurn(request, actor = {}) {
  if (actor.role !== 'Super Admin') {
    const error = new Error('Hanya Super Admin yang dapat memproses Burn');
    error.code = 'FORBIDDEN';
    throw error;
  }

  if (request?.status !== BURN_REQUEST_STATUS.APPROVED) {
    const error = new Error('Burn Request belum APPROVED');
    error.code = 'INVALID_STATUS';
    throw error;
  }

  return {
    ...request,
    status: BURN_REQUEST_STATUS.PROCESSING,
    processingBy: actor.userId || null,
    processingByRole: actor.role,
    processingAt: new Date().toISOString(),
  };
}
