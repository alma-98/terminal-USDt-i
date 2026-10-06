import {
  PAUSE_MODES,
  PAUSE_STATES,
} from './pauseConfig.js';
import { validatePauseInput } from './pauseValidation.js';

export function createPauseState({
  role,
  mode = PAUSE_MODES.APPLICATION,
  state = PAUSE_STATES.PAUSED,
  operation = 'TRANSFER',
} = {}) {
  const validation = validatePauseInput({
    role,
    mode,
    state,
  });

  if (!validation.valid) {
    const error = new Error('Pause request tidak valid');
    error.code = 'VALIDATION_ERROR';
    error.details = validation.errors;
    throw error;
  }

  return {
    mode,
    state,
    operation,
    updatedByRole: role,
    updatedAt: new Date().toISOString(),

    // Tidak membuat TX Hash palsu.
    txHash: null,
    explorerUrl: null,
    blockchainStatus:
      mode === PAUSE_MODES.APPLICATION
        ? 'NOT_APPLICABLE'
        : 'PENDING_BLOCKCHAIN',
  };
}

export function pauseApplication({
  role,
  operation,
} = {}) {
  return createPauseState({
    role,
    mode: PAUSE_MODES.APPLICATION,
    state: PAUSE_STATES.PAUSED,
    operation,
  });
}

export function unpauseApplication({
  role,
  operation,
} = {}) {
  return createPauseState({
    role,
    mode: PAUSE_MODES.APPLICATION,
    state: PAUSE_STATES.UNPAUSED,
    operation,
  });
}

export function prepareSmartContractPause({
  role,
  operation,
} = {}) {
  return createPauseState({
    role,
    mode: PAUSE_MODES.SMART_CONTRACT,
    state: PAUSE_STATES.PAUSED,
    operation,
  });
}

export function prepareSmartContractUnpause({
  role,
  operation,
} = {}) {
  return createPauseState({
    role,
    mode: PAUSE_MODES.SMART_CONTRACT,
    state: PAUSE_STATES.UNPAUSED,
    operation,
  });
}
