import {
  hasPermission
} from "../auth/permissionMatrix.js";

const tests = [
  {
    role: "super_admin",
    module: "refill",
    action: "create",
    expected: true
  },
  {
    role: "admin",
    module: "refill",
    action: "create",
    expected: false
  },
  {
    role: "super_admin",
    module: "burn",
    action: "approve",
    expected: true
  },
  {
    role: "admin",
    module: "burn",
    action: "approve",
    expected: false
  },
  {
    role: "admin",
    module: "transfer",
    action: "create",
    expected: true
  },
  {
    role: "admin",
    module: "tenor",
    action: "create",
    expected: false
  },
  {
    role: "admin",
    module: "pause",
    action: "create",
    expected: false
  },
  {
    role: "admin",
    module: "revoke_mint",
    action: "create",
    expected: false
  }
];

for (const test of tests) {
  const actual = hasPermission(
    test.role,
    test.module,
    test.action
  );

  if (actual !== test.expected) {
    throw new Error(
      `Permission test failed: ${test.role} ${test.module}.${test.action}`
    );
  }
}

console.log("Permission matrix tests: PASS");
