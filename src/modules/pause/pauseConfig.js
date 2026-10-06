export const PAUSE_MODES = Object.freeze({
  APPLICATION: 'Application Mode',
  SMART_CONTRACT: 'Smart Contract Mode',
});

export const PAUSE_STATES = Object.freeze({
  PAUSED: 'PAUSED',
  UNPAUSED: 'UNPAUSED',
});

export const PAUSE_ROLES = Object.freeze({
  SUPER_ADMIN: 'Super Admin',
});

export const PAUSE_OPERATIONS = Object.freeze([
  'TRANSFER',
  'SWAP',
  'REFILL',
  'BURN',
]);
