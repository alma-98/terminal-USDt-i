import assert from 'node:assert/strict';

import {
  setApplicationPause,
  prepareSmartContractPause,
} from '../backend/pause/pauseService.js';

const superAdmin = {
  userId: 'super-admin-test',
  role: 'Super Admin',
};

const admin = {
  userId: 'admin-test',
  role: 'Admin',
};

const applicationPaused = setApplicationPause({
  actor: superAdmin,
  operation: 'TRANSFER',
  state: 'PAUSED',
});

assert.equal(applicationPaused.mode, 'Application Mode');
assert.equal(applicationPaused.state, 'PAUSED');
assert.equal(applicationPaused.txHash, null);

const applicationUnpaused = setApplicationPause({
  actor: superAdmin,
  operation: 'TRANSFER',
  state: 'UNPAUSED',
});

assert.equal(applicationUnpaused.state, 'UNPAUSED');

const smartContract = prepareSmartContractPause({
  actor: superAdmin,
  operation: 'SWAP',
  state: 'PAUSED',
});

assert.equal(smartContract.mode, 'Smart Contract Mode');
assert.equal(smartContract.state, 'PAUSED');
assert.equal(smartContract.blockchainStatus, 'PENDING');
assert.equal(smartContract.txHash, null);

assert.throws(
  () =>
    setApplicationPause({
      actor: admin,
      operation: 'TRANSFER',
      state: 'PAUSED',
    }),
  /FORBIDDEN/
);

console.log('Pause test: PASS');
console.log('Application Pause: PASS');
console.log('Application Unpause: PASS');
console.log('Smart Contract Pause preparation: PASS');
console.log('Admin Pause attempt: BLOCKED');
console.log('Fake TX hash: NONE');
