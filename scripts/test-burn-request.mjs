import assert from 'node:assert/strict';

import {
  createBurnRequest,
  approveBurnRequest,
  rejectBurnRequest,
  processApprovedBurn,
} from '../backend/burn/burnService.js';

const admin = {
  userId: 'admin-test',
  role: 'Admin',
};

const superAdmin = {
  userId: 'super-admin-test',
  role: 'Super Admin',
};

const base = {
  coinId: 'USDt',
  walletAddress: '0x0000000000000000000000000000000000000001',
  amount: 100,
  reason: 'Burn request test',
};

const pending = createBurnRequest(base, admin);

assert.equal(pending.status, 'PENDING');
assert.equal(pending.requestedByRole, 'Admin');

assert.throws(
  () => processApprovedBurn(pending, admin),
  /FORBIDDEN/
);

const approved = approveBurnRequest(pending, superAdmin);
assert.equal(approved.status, 'APPROVED');

const processing = processApprovedBurn(approved, superAdmin);
assert.equal(processing.status, 'PROCESSING');

const pending2 = createBurnRequest(base, admin);
const rejected = rejectBurnRequest(
  pending2,
  superAdmin,
  'Rejected during test'
);

assert.equal(rejected.status, 'REJECTED');

console.log('Burn Request test: PASS');
console.log('Admin create request: PASS');
console.log('Admin direct burn blocked: PASS');
console.log('Super Admin approval: PASS');
console.log('Super Admin processing: PASS');
console.log('Super Admin reject: PASS');
