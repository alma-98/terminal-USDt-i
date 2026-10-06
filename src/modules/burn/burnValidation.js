import { BURN_REQUEST_STATUS } from './burnConfig.js';

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export function validateBurnRequest(input = {}) {
  const errors = {};

  if (!input.coinId || !String(input.coinId).trim()) {
    errors.coinId = 'Coin wajib dipilih';
  }

  if (!input.walletAddress || !ADDRESS_RE.test(String(input.walletAddress).trim())) {
    errors.walletAddress = 'Wallet address tidak valid';
  }

  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = 'Amount harus lebih besar dari 0';
  }

  if (!input.reason || !String(input.reason).trim()) {
    errors.reason = 'Alasan burn wajib diisi';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function canCreateBurnRequest(role) {
  return role === 'Admin' || role === 'Super Admin';
}

export function canApproveBurn(role) {
  return role === 'Super Admin';
}

export function canDirectBurn(role) {
  return role === 'Super Admin';
}

export function canProcessBurn(role) {
  return role === 'Super Admin';
}

export function isPendingBurn(status) {
  return status === BURN_REQUEST_STATUS.PENDING;
}
