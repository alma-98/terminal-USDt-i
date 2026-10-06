const AUDIT_COLLECTION = 'audit_logs';

const AUDIT_ACTIONS = Object.freeze([
  'Login',
  'Logout',
  'Coin Create',
  'Coin Read',
  'Coin Update',
  'Coin Delete',
  'Coin Activate',
  'Coin Disable',
  'Tenor Create',
  'Tenor Update',
  'Tenor Delete',
  'Wallet Create',
  'Wallet Update',
  'Wallet Delete',
  'Allocation',
  'Transfer',
  'Refill',
  'Swap',
  'Swap Pair Create',
  'Swap Pair Update',
  'Swap Pair Delete',
  'Hash Create',
  'Hash Edit',
  'Burn Request',
  'Burn Approval',
  'Burn Reject',
  'Pause',
  'Unpause',
  'Revoke Mint',
  'Provider Change',
  'Network Change',
  'Permission Change',
]);

const AUDIT_STATUS = Object.freeze([
  'SUCCESS',
  'FAILED',
  'PENDING',
  'REJECTED',
]);

function snapshot(value) {
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
}) {
  if (!userId) {
    throw new Error('userId wajib diisi');
  }

  if (!role) {
    throw new Error('role wajib diisi');
  }

  if (!AUDIT_ACTIONS.includes(action)) {
    throw new Error(`Audit action tidak valid: ${action}`);
  }

  if (!objectType) {
    throw new Error('objectType wajib diisi');
  }

  if (!AUDIT_STATUS.includes(status)) {
    throw new Error(`Audit status tidak valid: ${status}`);
  }

  const timestamp = new Date().toISOString();

  return Object.freeze({
    id: `AUDIT-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`,

    userId,
    role,
    action,
    objectType,
    objectId,

    timestamp,

    oldValue: snapshot(oldValue),
    newValue: snapshot(newValue),

    status,
    reason,

    createdAt: timestamp,
  });
}

export function getAuditCollectionName() {
  return AUDIT_COLLECTION;
}

/**
 * Audit Log tidak mempunyai operasi edit/delete.
 */
export function updateAuditRecord() {
  throw new Error(
    'AUDIT_IMMUTABLE: audit record tidak dapat diedit'
  );
}

export function deleteAuditRecord() {
  throw new Error(
    'AUDIT_IMMUTABLE: audit record tidak dapat dihapus'
  );
}
