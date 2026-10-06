import assert from 'node:assert/strict';

import {
  validateSafePayload,
  containsSecretKey,
} from '../src/modules/security/securityValidation.js';

import {
  requireRole,
  requireSuperAdmin,
} from '../src/modules/security/authorization.js';

import {
  createReauthSession,
  isReauthValid,
  requireReauth,
} from '../src/modules/security/reauthentication.js';

import {
  createRateLimiter,
} from '../src/modules/security/rateLimit.js';

import {
  createSecurityEvent,
} from '../src/modules/security/securityLogger.js';

import {
  sanitizeForClient,
} from '../backend/security/secretGuard.js';

import {
  createServerRateLimiter,
} from '../backend/security/rateLimit.js';

const safe = validateSafePayload({
  coin: 'USDt',
  amount: '1000',
});

assert.equal(safe.valid, true);

const unsafe = validateSafePayload({
  seedPhrase: 'DO-NOT-USE',
});

assert.equal(unsafe.valid, false);
assert.equal(
  unsafe.reason,
  'SENSITIVE_SECRET_FIELD'
);

assert.equal(
  containsSecretKey({
    apiSecret: 'DO-NOT-USE',
  }),
  true
);

assert.doesNotThrow(() =>
  requireRole(
    { role: 'Admin' },
    ['Admin', 'Super Admin']
  )
);

assert.throws(
  () =>
    requireRole(
      { role: 'Admin' },
      ['Super Admin']
    ),
  /FORBIDDEN/
);

assert.doesNotThrow(() =>
  requireSuperAdmin({
    role: 'Super Admin',
  })
);

assert.throws(
  () =>
    requireSuperAdmin({
      role: 'Admin',
    }),
  /FORBIDDEN/
);

const now = Date.now();

const reauth = createReauthSession({
  userId: 'super-admin-001',
  verifiedAt: now,
});

assert.equal(
  isReauthValid(
    reauth,
    'super-admin-001',
    now + 1000
  ),
  true
);

assert.doesNotThrow(() =>
  requireReauth(
    reauth,
    'super-admin-001',
    now + 1000
  )
);

assert.throws(
  () =>
    requireReauth(
      reauth,
      'admin-001',
      now + 1000
    ),
  /REAUTH_REQUIRED/
);

const limiter = createRateLimiter({
  maxRequests: 2,
  windowMs: 60000,
});

assert.equal(
  limiter.check('user-1').allowed,
  true
);

assert.equal(
  limiter.check('user-1').allowed,
  true
);

assert.equal(
  limiter.check('user-1').allowed,
  false
);

const serverLimiter =
  createServerRateLimiter({
    maxRequests: 1,
    windowMs: 60000,
  });

assert.equal(
  serverLimiter.check('ip-1'),
  true
);

assert.equal(
  serverLimiter.check('ip-1'),
  false
);

const clientData = sanitizeForClient({
  userId: 'admin-001',
  role: 'Admin',
  apiSecret: 'SECRET',
  privateKey: 'SECRET',
  seedPhrase: 'SECRET',
  nested: {
    password: 'SECRET',
    visible: true,
  },
});

assert.equal(
  clientData.apiSecret,
  undefined
);

assert.equal(
  clientData.privateKey,
  undefined
);

assert.equal(
  clientData.seedPhrase,
  undefined
);

assert.equal(
  clientData.nested.password,
  undefined
);

assert.equal(
  clientData.nested.visible,
  true
);

const securityEvent = createSecurityEvent({
  userId: 'admin-001',
  role: 'Admin',
  action: 'SECURITY_VALIDATION',
  status: 'SUCCESS',
  reason: 'Payload validated',
});

assert.equal(
  securityEvent.userId,
  'admin-001'
);

assert.equal(
  securityEvent.role,
  'Admin'
);

assert.ok(securityEvent.timestamp);

assert.equal(
  Object.prototype.hasOwnProperty.call(
    securityEvent,
    'password'
  ),
  false
);

console.log('Security Hardening test: PASS');
console.log('Payload Validation: PASS');
console.log('Secret Field Detection: PASS');
console.log('Role Authorization: PASS');
console.log('Super Admin Authorization: PASS');
console.log('Re-authentication: PASS');
console.log('Rate Limit Frontend Guard: PASS');
console.log('Rate Limit Backend Guard: PASS');
console.log('Client Secret Sanitization: PASS');
console.log('Security Logging: PASS');
console.log('Private Key/Seed Phrase Exposure: BLOCKED');
console.log('API Secret Exposure: BLOCKED');
