import {
  MINT_STATES,
  REVOKE_MINT_MODES,
} from './revokeMintConfig.js';

import {
  validateRevokeMintInput,
} from './revokeMintValidation.js';

export function revokeMint({
  role,
  coinId,
  mode = REVOKE_MINT_MODES.APPLICATION,
} = {}) {
  const validation = validateRevokeMintInput({
    role,
    coinId,
    mode,
    targetState: MINT_STATES.REVOKED,
  });

  if (!validation.valid) {
    const error = new Error('Revoke Mint request tidak valid');
    error.code = 'VALIDATION_ERROR';
    error.details = validation.errors;
    throw error;
  }

  const base = {
    coinId,
    mode,
    mintStatus: MINT_STATES.REVOKED,
    updatedByRole: role,
    updatedAt: new Date().toISOString(),

    // Tidak pernah membuat TX Hash palsu.
    txHash: null,
    explorerUrl: null,
  };

  if (mode === REVOKE_MINT_MODES.APPLICATION) {
    return {
      ...base,
      blockchainStatus: 'NOT_APPLICABLE',
      description:
        'Mint hanya dicabut pada level aplikasi.',
    };
  }

  return {
    ...base,
    blockchainStatus: 'PENDING_BLOCKCHAIN',
    description:
      'Revoke Mint on-chain hanya dapat dilakukan jika Smart Contract mendukung permission revoke.',
  };
}

export function prepareSmartContractRevokeMint({
  role,
  coinId,
} = {}) {
  return revokeMint({
    role,
    coinId,
    mode: REVOKE_MINT_MODES.SMART_CONTRACT,
  });
}
