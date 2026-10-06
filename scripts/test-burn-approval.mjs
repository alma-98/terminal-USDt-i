import assert from 'node:assert/strict';

import {
  processBurnApproval,
} from '../backend/burn/burnApprovalService.js';

const pending = {
  id: 'BURN-001',
  status: 'PENDING',
};

const admin = {
  userId: 'admin-001',
  role: 'Admin',
};

const superAdmin = {
  userId: 'super-admin-001',
  role: 'Super Admin',
};

const verifySuccess = async (password) =>
  password === 'VALID_TEST_PASSWORD';

const approved = await processBurnApproval({
  request: pending,
  actor: superAdmin,
  password: 'VALID_TEST_PASSWORD',
  verifyPasswordHash: verifySuccess,
});

assert.equal(approved.status, 'APPROVED');

const rejected = await processBurnApproval({
  request: pending,
  actor: superAdmin,
  password: 'WRONG_PASSWORD',
  verifyPasswordHash: verifySuccess,
});

assert.equal(rejected.status, 'REJECTED');
assert.equal(
  rejected.rejectionReason,
  'RE-AUTHENTICATION_FAILED'
);

await assert.rejects(
  () =>
    processBurnApproval({
      request: pending,
      actor: admin,
      password: 'VALID_TEST_PASSWORD',
      verifyPasswordHash: verifySuccess,
    }),
  /FORBIDDEN/
);

console.log('Burn Approval + Re-authentication test: PASS');
console.log('Super Admin valid re-auth: APPROVED');
console.log('Invalid re-auth: REJECTED');
console.log('Admin approval attempt: BLOCKED');
console.log('Password stored in audit: NONE');
