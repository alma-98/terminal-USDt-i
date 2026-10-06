import {
  AUDIT_ACTIONS,
  AUDIT_STATUS,
} from './auditConfig.js';

export function validateAuditEvent(event = {}) {
  const errors = {};

  if (!event.userId) {
    errors.userId = 'userId wajib diisi';
  }

  if (!event.role) {
    errors.role = 'role wajib diisi';
  }

  if (!AUDIT_ACTIONS.includes(event.action)) {
    errors.action = 'action tidak terdaftar';
  }

  if (!event.objectType) {
    errors.objectType = 'objectType wajib diisi';
  }

  if (!AUDIT_STATUS.includes(event.status)) {
    errors.status = 'status tidak valid';
  }

  if (!event.timestamp) {
    errors.timestamp = 'timestamp wajib diisi';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
