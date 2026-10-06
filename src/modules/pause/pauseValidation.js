import {
  PAUSE_MODES,
  PAUSE_ROLES,
  PAUSE_STATES,
} from './pauseConfig.js';

export function validatePauseInput(input = {}) {
  const errors = {};

  if (input.role !== PAUSE_ROLES.SUPER_ADMIN) {
    errors.role = 'Hanya Super Admin yang dapat melakukan Pause';
  }

  if (!Object.values(PAUSE_MODES).includes(input.mode)) {
    errors.mode = 'Pause mode tidak valid';
  }

  if (!Object.values(PAUSE_STATES).includes(input.state)) {
    errors.state = 'Pause state tidak valid';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function canPause(role) {
  return role === PAUSE_ROLES.SUPER_ADMIN;
}
