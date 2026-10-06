const PAUSE_COLLECTION = 'system_settings';

const MODES = Object.freeze({
  APPLICATION: 'Application Mode',
  SMART_CONTRACT: 'Smart Contract Mode',
});

const STATES = Object.freeze({
  PAUSED: 'PAUSED',
  UNPAUSED: 'UNPAUSED',
});

function assertSuperAdmin(actor) {
  if (actor?.role !== 'Super Admin') {
    const error = new Error('FORBIDDEN');
    error.code = 'FORBIDDEN';
    throw error;
  }
}

export function setApplicationPause({
  actor,
  operation,
  state,
}) {
  assertSuperAdmin(actor);

  if (!Object.values(STATES).includes(state)) {
    throw new Error('Invalid pause state');
  }

  return {
    collection: PAUSE_COLLECTION,
    mode: MODES.APPLICATION,
    operation,
    state,
    updatedBy: actor.userId || null,
    updatedAt: new Date().toISOString(),

    // Application Mode tidak memiliki transaksi blockchain.
    txHash: null,
    explorerUrl: null,
  };
}

export function prepareSmartContractPause({
  actor,
  operation,
  state,
}) {
  assertSuperAdmin(actor);

  if (!Object.values(STATES).includes(state)) {
    throw new Error('Invalid pause state');
  }

  return {
    collection: PAUSE_COLLECTION,
    mode: MODES.SMART_CONTRACT,
    operation,
    state,
    updatedBy: actor.userId || null,
    updatedAt: new Date().toISOString(),

    // Diisi hanya setelah transaksi blockchain nyata.
    txHash: null,
    explorerUrl: null,
    blockchainStatus: 'PENDING',
  };
}

export function getPauseCollection() {
  return PAUSE_COLLECTION;
}

export { MODES, STATES };
