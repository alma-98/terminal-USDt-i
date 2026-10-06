import {
  MINT_STATES,
  REVOKE_MINT_MODES,
  REVOKE_MINT_ROLES,
} from './revokeMintConfig.js';

export function validateRevokeMintInput(input = {}) {
  const errors = {};

  if (input.role !== REVOKE_MINT_ROLES.SUPER_ADMIN) {
    errors.role = 'Hanya Super Admin yang dapat Revoke Mint';
  }

  if (!input.coinId || !String(input.coinId).trim()) {
    errors.coinId = 'Coin wajib dipilih';
  }

  if (!Object.values(REVOKE_MINT_MODES).includes(input.mode)) {
    errors.mode = 'Mode Revoke Mint tidak valid';
  }

  if (!Object.values(MINT_STATES).includes(input.targetState)) {
    errors.targetState = 'Mint state tidak valid';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function canRevokeMint(role) {
  return role === REVOKE_MINT_ROLES.SUPER_ADMIN;
}
