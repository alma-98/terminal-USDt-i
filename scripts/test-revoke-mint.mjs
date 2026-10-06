import assert from 'node:assert/strict';

import {
  revokeMint,
} from '../backend/revokeMint/revokeMintService.js';

const superAdmin = {
  userId: 'super-admin-test',
  role: 'Super Admin',
};

const admin = {
  userId: 'admin-test',
  role: 'Admin',
};

const application = revokeMint({
  actor: superAdmin,
  coinId: 'USDt',
  mode: 'Application Mode',
});

assert.equal(application.mintStatus, 'REVOKED');
assert.equal(application.mode, 'Application Mode');
assert.equal(
  application.blockchainStatus,
  'NOT_APPLICABLE'
);
assert.equal(application.txHash, null);

const smartContract = revokeMint({
  actor: superAdmin,
  coinId: 'USDt',
  mode: 'Smart Contract Mode',
});

assert.equal(smartContract.mintStatus, 'REVOKED');
assert.equal(
  smartContract.mode,
  'Smart Contract Mode'
);
assert.equal(
  smartContract.blockchainStatus,
  'PENDING_BLOCKCHAIN'
);
assert.equal(smartContract.txHash, null);

assert.throws(
  () =>
    revokeMint({
      actor: admin,
      coinId: 'USDt',
      mode: 'Application Mode',
    }),
  /FORBIDDEN/
);

console.log('Revoke Mint test: PASS');
console.log('Application Mode: REVOKED');
console.log('Smart Contract Mode: PREPARED');
console.log('Admin Revoke Mint attempt: BLOCKED');
console.log('Fake TX hash: NONE');
