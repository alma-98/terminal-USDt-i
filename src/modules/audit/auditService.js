import {
  AUDIT_IMMUTABLE_FIELDS,
} from './auditConfig.js';

import {
  validateAuditEvent,
} from './auditValidation.js';

function safeSnapshot(value) {
  if (value === undefined || value === null) {
    return null;
  }

  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return String(value);
  }
}

export function createAuditRecord({
  userId,
  role,
  action,
  objectType,
  objectId = null,
  oldValue = null,
  newValue = null,
  status = 'SUCCESS',
  reason = null,
} = {}) {
  const timestamp = new Date().toISOString();

  const record = {
    id: `AUDIT-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`,

    userId,
    role,
    action,
    objectType,
    objectId,

    timestamp,

    oldValue: safeSnapshot(oldValue),
    newValue: safeSnapshot(newValue),

    status,
    reason,

    createdAt: timestamp,
  };

  const validation = validateAuditEvent(record);

  if (!validation.valid) {
    const error = new Error('Audit event tidak valid');
    error.code = 'VALIDATION_ERROR';
    error.details = validation.errors;
    throw error;
  }

  return Object.freeze(record);
}

export function isImmutableAuditField(field) {
  return AUDIT_IMMUTABLE_FIELDS.includes(field);
}

/**
 * Audit record tidak menyediakan edit/delete.
 * Setiap perubahan harus dibuat sebagai audit event baru.
 */
export function updateAuditRecord() {
  throw new Error(
    'Audit Log immutable-style: record tidak dapat diedit'
  );
}

export function deleteAuditRecord() {
  throw new Error(
    'Audit Log immutable-style: record tidak dapat dihapus'
  );
}
