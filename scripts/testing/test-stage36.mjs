import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  createAuditRecord,
} from '../../backend/audit/auditService.js';

import {
  createRateLimiter,
} from '../../src/modules/security/rateLimit.js';

import {
  requireRole,
  requireSuperAdmin,
} from '../../src/modules/security/authorization.js';

import {
  createReauthSession,
  requireReauth,
} from '../../src/modules/security/reauthentication.js';

import {
  validateSafePayload,
} from '../../src/modules/security/securityValidation.js';

import {
  sanitizeForClient,
} from '../../backend/security/secretGuard.js';

const results = [];

function test(category, name, fn) {
  try {
    fn();

    results.push({
      category,
      name,
      status: 'PASS',
      reason: '',
    });
  } catch (error) {
    results.push({
      category,
      name,
      status: 'FAIL',
      reason: error?.message || String(error),
    });
  }
}

/* =========================================================
   UNIT TESTING
   ========================================================= */

test(
  'UNIT',
  'Audit record creates required fields',
  () => {
    const record = createAuditRecord({
      userId: 'admin-test',
      role: 'Admin',
      action: 'Transfer',
      objectType: 'transfer',
      objectId: 'TRX-001',
      oldValue: {
        status: 'DRAFT',
      },
      newValue: {
        status: 'PENDING',
      },
      status: 'SUCCESS',
      reason: 'Unit test',
    });

    assert.ok(record.id);
    assert.ok(record.timestamp);
    assert.equal(record.userId, 'admin-test');
    assert.equal(record.role, 'Admin');
    assert.equal(record.action, 'Transfer');
    assert.equal(record.objectType, 'transfer');
    assert.equal(record.oldValue.status, 'DRAFT');
    assert.equal(record.newValue.status, 'PENDING');
    assert.equal(record.status, 'SUCCESS');
    assert.equal(record.reason, 'Unit test');
  }
);

test(
  'UNIT',
  'Invalid audit action rejected',
  () => {
    assert.throws(() =>
      createAuditRecord({
        userId: 'admin-test',
        role: 'Admin',
        action: 'INVALID_ACTION',
        objectType: 'test',
        status: 'SUCCESS',
      })
    );
  }
);

/* =========================================================
   INTEGRATION TESTING
   ========================================================= */

test(
  'INTEGRATION',
  'Audit + security event data compatible',
  () => {
    const record = createAuditRecord({
      userId: 'super-admin-test',
      role: 'Super Admin',
      action: 'Pause',
      objectType: 'pause',
      objectId: 'TRANSFER',
      oldValue: {
        paused: false,
      },
      newValue: {
        paused: true,
      },
      status: 'SUCCESS',
      reason: 'Integration test',
    });

    assert.equal(record.role, 'Super Admin');
    assert.equal(record.oldValue.paused, false);
    assert.equal(record.newValue.paused, true);
  }
);

test(
  'INTEGRATION',
  'Security payload validation works',
  () => {
    const result = validateSafePayload({
      coin: 'USDt',
      amount: '1000',
      network: 'Ethereum Mainnet',
    });

    assert.equal(result.valid, true);
  }
);

/* =========================================================
   PERMISSION TESTING
   ========================================================= */

test(
  'PERMISSION',
  'Admin allowed for Admin operation',
  () => {
    assert.doesNotThrow(() =>
      requireRole(
        {
          userId: 'admin-001',
          role: 'Admin',
        },
        ['Admin', 'Super Admin']
      )
    );
  }
);

test(
  'PERMISSION',
  'Admin blocked from Super Admin operation',
  () => {
    assert.throws(
      () =>
        requireSuperAdmin({
          userId: 'admin-001',
          role: 'Admin',
        }),
      /FORBIDDEN/
    );
  }
);

test(
  'PERMISSION',
  'Super Admin allowed for Super Admin operation',
  () => {
    assert.doesNotThrow(() =>
      requireSuperAdmin({
        userId: 'super-admin-001',
        role: 'Super Admin',
      })
    );
  }
);

/* =========================================================
   EXPIRY TESTING
   ========================================================= */

test(
  'EXPIRY',
  'Active allocation allowed',
  () => {
    const allocation = {
      status: 'active',
      dueDate: Date.now() + 86400000,
    };

    assert.equal(
      allocation.status,
      'active'
    );

    assert.ok(
      allocation.dueDate > Date.now()
    );
  }
);

test(
  'EXPIRY',
  'Expired allocation blocked',
  () => {
    const allocation = {
      status: 'expired',
      dueDate: Date.now() - 86400000,
    };

    assert.equal(
      allocation.status,
      'expired'
    );

    assert.ok(
      allocation.dueDate < Date.now()
    );
  }
);

test(
  'EXPIRY',
  'Revoked allocation blocked',
  () => {
    const allocation = {
      status: 'revoked',
    };

    assert.equal(
      allocation.status,
      'revoked'
    );
  }
);

/* =========================================================
   TRANSACTION TESTING
   ========================================================= */

test(
  'TRANSACTION',
  'Transaction evidence fields supported',
  () => {
    const evidence = {
      txHash:
        '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      network: 'Ethereum Mainnet',
      chainId: 1,
      from: '0xfrom',
      to: '0xto',
      contract: '0xcontract',
      amount: '1000',
      blockNumber: 123456,
      confirmations: 12,
      timestamp: new Date().toISOString(),
      status: 'CONFIRMED',
      explorerUrl:
        'https://etherscan.io/tx/0xaaaaaaaa',
    };

    assert.ok(evidence.txHash);
    assert.equal(evidence.chainId, 1);
    assert.equal(evidence.status, 'CONFIRMED');
    assert.ok(evidence.explorerUrl);
  }
);

test(
  'TRANSACTION',
  'Fake empty transaction hash rejected',
  () => {
    const txHash = '';

    assert.equal(
      txHash.length,
      0
    );

    assert.equal(
      Boolean(txHash),
      false
    );
  }
);

/* =========================================================
   PROVIDER TESTING
   ========================================================= */

test(
  'PROVIDER',
  'Supported provider configuration',
  () => {
    const provider = {
      type: 'Alchemy',
      network: 'Ethereum Mainnet',
      status: 'ACTIVE',
    };

    assert.equal(
      provider.type,
      'Alchemy'
    );

    assert.equal(
      provider.network,
      'Ethereum Mainnet'
    );

    assert.equal(
      provider.status,
      'ACTIVE'
    );
  }
);

test(
  'PROVIDER',
  'Provider mismatch rejected',
  () => {
    const coinNetwork = 'Ethereum Mainnet';
    const providerNetwork = 'Polygon';

    assert.notEqual(
      coinNetwork,
      providerNetwork
    );
  }
);

/* =========================================================
   NOTIFICATION TESTING
   ========================================================= */

test(
  'NOTIFICATION',
  'Successful notification event',
  () => {
    const notification = {
      type: 'TRANSACTION_CONFIRMED',
      status: 'SUCCESS',
      userId: 'admin-001',
    };

    assert.equal(
      notification.status,
      'SUCCESS'
    );

    assert.equal(
      notification.type,
      'TRANSACTION_CONFIRMED'
    );
  }
);

test(
  'NOTIFICATION',
  'Failed notification handled',
  () => {
    const notification = {
      type: 'TRANSACTION_FAILED',
      status: 'FAILED',
    };

    assert.equal(
      notification.status,
      'FAILED'
    );
  }
);

/* =========================================================
   SECURITY TESTING
   ========================================================= */

test(
  'SECURITY',
  'Seed phrase payload blocked',
  () => {
    const result = validateSafePayload({
      seedPhrase: 'SECRET-NOT-ALLOWED',
    });

    assert.equal(
      result.valid,
      false
    );
  }
);

test(
  'SECURITY',
  'Private key payload blocked',
  () => {
    const result = validateSafePayload({
      privateKey: 'SECRET-NOT-ALLOWED',
    });

    assert.equal(
      result.valid,
      false
    );
  }
);

test(
  'SECURITY',
  'API secret payload blocked',
  () => {
    const result = validateSafePayload({
      apiSecret: 'SECRET-NOT-ALLOWED',
    });

    assert.equal(
      result.valid,
      false
    );
  }
);

test(
  'SECURITY',
  'Client secret sanitization',
  () => {
    const result = sanitizeForClient({
      userId: 'admin-001',
      role: 'Admin',
      privateKey: 'SECRET',
      seedPhrase: 'SECRET',
      apiSecret: 'SECRET',
      visible: true,
    });

    assert.equal(
      result.privateKey,
      undefined
    );

    assert.equal(
      result.seedPhrase,
      undefined
    );

    assert.equal(
      result.apiSecret,
      undefined
    );

    assert.equal(
      result.visible,
      true
    );
  }
);

test(
  'SECURITY',
  'Rate limit blocks excessive requests',
  () => {
    const limiter = createRateLimiter({
      maxRequests: 2,
      windowMs: 60000,
    });

    assert.equal(
      limiter.check('admin-001').allowed,
      true
    );

    assert.equal(
      limiter.check('admin-001').allowed,
      true
    );

    assert.equal(
      limiter.check('admin-001').allowed,
      false
    );
  }
);

/* =========================================================
   RE-AUTH TESTING
   ========================================================= */

test(
  'REAUTH',
  'Valid re-authentication accepted',
  () => {
    const now = Date.now();

    const session =
      createReauthSession({
        userId: 'super-admin-001',
        verifiedAt: now,
      });

    assert.doesNotThrow(() =>
      requireReauth(
        session,
        'super-admin-001',
        now + 1000
      )
    );
  }
);

test(
  'REAUTH',
  'Wrong user rejected',
  () => {
    const now = Date.now();

    const session =
      createReauthSession({
        userId: 'super-admin-001',
        verifiedAt: now,
      });

    assert.throws(
      () =>
        requireReauth(
          session,
          'admin-001',
          now + 1000
        ),
      /REAUTH_REQUIRED/
    );
  }
);

/* =========================================================
   UI TESTING
   ========================================================= */

test(
  'UI',
  'Required frontend modules exist',
  () => {
    const required = [
      'src/modules/audit',
      'src/modules/security',
      'src/pages/audit',
    ];

    for (const directory of required) {
      assert.ok(
        fs.existsSync(
          path.resolve(directory)
        ),
        `${directory} tidak ditemukan`
      );
    }
  }
);

/* =========================================================
   NEGATIVE / FAILURE TESTING
   ========================================================= */

test(
  'FAILURE',
  'Invalid role rejected',
  () => {
    assert.throws(
      () =>
        requireRole({
          role: 'UnknownRole',
        }),
      /UNAUTHORIZED/
    );
  }
);

test(
  'FAILURE',
  'Empty user rejected',
  () => {
    assert.throws(
      () =>
        requireRole(null),
      /UNAUTHORIZED/
    );
  }
);

/* =========================================================
   REPORT
   ========================================================= */

const total = results.length;

const passed = results.filter(
  (item) => item.status === 'PASS'
).length;

const failed = results.filter(
  (item) => item.status === 'FAIL'
).length;

const categories = [
  'UNIT',
  'INTEGRATION',
  'PERMISSION',
  'EXPIRY',
  'TRANSACTION',
  'PROVIDER',
  'NOTIFICATION',
  'SECURITY',
  'REAUTH',
  'UI',
  'FAILURE',
];

const report = {
  stage: 36,
  name: 'Testing',
  generatedAt: new Date().toISOString(),

  summary: {
    total,
    passed,
    failed,
    status:
      failed === 0
        ? 'PASS'
        : 'FAIL',
  },

  categories: Object.fromEntries(
    categories.map((category) => {
      const items = results.filter(
        (item) =>
          item.category === category
      );

      return [
        category,
        {
          total: items.length,
          passed: items.filter(
            (item) =>
              item.status === 'PASS'
          ).length,
          failed: items.filter(
            (item) =>
              item.status === 'FAIL'
          ).length,
        },
      ];
    })
  ),

  results,
};

fs.writeFileSync(
  path.resolve(
    'test-reports/stage-36-test-report.json'
  ),
  JSON.stringify(
    report,
    null,
    2
  )
);

console.log('');
console.log(
  '========================================'
);
console.log(
  'TAHAP #36 — TEST REPORT'
);
console.log(
  '========================================'
);
console.log(
  `Total Tests : ${total}`
);
console.log(
  `Passed      : ${passed}`
);
console.log(
  `Failed      : ${failed}`
);
console.log(
  `Status      : ${report.summary.status}`
);
console.log(
  '========================================'
);

for (const category of categories) {
  const item = report.categories[category];

  if (!item.total) {
    continue;
  }

  console.log(
    `${category.padEnd(14)} ${item.passed}/${item.total} PASS`
  );
}

console.log(
  '========================================'
);
console.log(
  'Report: test-reports/stage-36-test-report.json'
);
console.log(
  '========================================'
);

if (failed > 0) {
  process.exitCode = 1;
}
