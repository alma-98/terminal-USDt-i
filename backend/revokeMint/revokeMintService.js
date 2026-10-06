const MODES = Object.freeze({
  APPLICATION: 'Application Mode',
  SMART_CONTRACT: 'Smart Contract Mode',
});

const MINT_STATES = Object.freeze({
  ENABLED: 'ENABLED',
  REVOKED: 'REVOKED',
});

function assertSuperAdmin(actor) {
  if (actor?.role !== 'Super Admin') {
    const error = new Error('FORBIDDEN');
    error.code = 'FORBIDDEN';
    throw error;
  }
}

export function revokeMint({
  actor,
  coinId,
  mode = MODES.APPLICATION,
}) {
  assertSuperAdmin(actor);

  if (!coinId) {
    throw new Error('coinId wajib diisi');
  }

  if (!Object.values(MODES).includes(mode)) {
    throw new Error('Invalid Revoke Mint mode');
  }

  const result = {
    coinId,
    mode,
    mintStatus: MINT_STATES.REVOKED,
    updatedBy: actor.userId || null,
    updatedAt: new Date().toISOString(),

    txHash: null,
    explorerUrl: null,
  };

  if (mode === MODES.APPLICATION) {
    return {
      ...result,
      blockchainStatus: 'NOT_APPLICABLE',
    };
  }

  return {
    ...result,
    blockchainStatus: 'PENDING_BLOCKCHAIN',
    requiresSmartContractPermission: true,
  };
}

export function getRevokeMintModes() {
  return MODES;
}

export function getMintStates() {
  return MINT_STATES;
}
