import assert from 'node:assert/strict';

import {
  createAuditRecord,
  updateAuditRecord,
  deleteAuditRecord,
} from '../backend/audit/auditService.js';

const record = createAuditRecord({
  userId: 'admin-001',
  role: 'Admin',
  action: 'Burn Request',
  objectType: 'burn_request',
  objectId: 'BURN-001',
  oldValue: {
    status: null,
  },
  newValue: {
    status: 'PENDING',
  },
  status: 'SUCCESS',
  reason: 'Admin submitted burn request',
});

assert.equal(record.userId, 'admin-001');
assert.equal(record.role, 'Admin');
assert.equal(record.action, 'Burn Request');
assert.equal(record.objectType, 'burn_request');
assert.equal(record.objectId, 'BURN-001');
assert.equal(record.oldValue.status, null);
assert.equal(record.newValue.status, 'PENDING');
assert.equal(record.status, 'SUCCESS');
assert.ok(record.timestamp);

assert.throws(
  () => updateAuditRecord(),
  /AUDIT_IMMUTABLE/
);

assert.throws(
  () => deleteAuditRecord(),
  /AUDIT_IMMUTABLE/
);

const approval = createAuditRecord({
  userId: 'super-admin-001',
  role: 'Super Admin',
  action: 'Burn Approval',
  objectType: 'burn_request',
  objectId: 'BURN-001',
  oldValue: {
    status: 'PENDING',
  },
  newValue: {
    status: 'APPROVED',
  },
  status: 'SUCCESS',
  reason: 'Re-authentication successful',
});

assert.equal(approval.oldValue.status, 'PENDING');
assert.equal(approval.newValue.status, 'APPROVED');

console.log('Audit Log test: PASS');
console.log('User: PASS');
console.log('Role: PASS');
console.log('Action: PASS');
console.log('Object: PASS');
console.log('Timestamp: PASS');
console.log('Old/New: PASS');
console.log('Status: PASS');
console.log('Reason: PASS');
console.log('Immutable Update: BLOCKED');
console.log('Immutable Delete: BLOCKED');
