/*
 * TERMINAL-USDt-i
 * Firestore collection definitions.
 *
 * Schema reference only.
 * Production writes must pass backend authorization
 * and Firebase Security Rules.
 */

export const COLLECTIONS = Object.freeze({
  USERS: "users",
  PERMISSIONS: "permissions",

  COINS: "coins",
  TENORS: "tenors",

  WALLETS: "wallets",
  ALLOCATIONS: "allocations",

  TRANSFERS: "transfers",
  TRANSACTIONS: "transactions",

  SWAPS: "swaps",
  BURN_REQUESTS: "burnRequests",
  BURN_APPROVALS: "burnApprovals",

  PROVIDERS: "providers",

  AUDIT_LOGS: "auditLogs",
  NOTIFICATIONS: "notifications",

  SETTINGS: "settings"
});

export const USER_SCHEMA = {
  uid: "string",
  email: "string",
  displayName: "string",
  role: "super_admin | admin",
  permissions: "string[]",
  active: "boolean",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

export const COIN_SCHEMA = {
  name: "string",
  symbol: "string",
  contractAddress: "string | null",
  networkId: "string",
  decimals: "number",
  active: "boolean",
  paused: "boolean",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

export const TENOR_SCHEMA = {
  name: "string",
  days: "number",
  active: "boolean",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

export const WALLET_SCHEMA = {
  name: "string",
  address: "string",
  type: "deployer | admin | destination",
  ownerUid: "string | null",
  networkId: "string",
  active: "boolean",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

/*
 * IMPORTANT:
 *
 * Allocation belongs to a specific wallet + coin + tenor.
 *
 * This is what allows:
 *
 * Wallet A + Tenor 9 days
 *     -> expires after 9 days
 *
 * Wallet B + Tenor 3 days
 *     -> expires after 3 days
 *
 * Expiry is NOT global for the coin.
 */

export const ALLOCATION_SCHEMA = {
  walletId: "string",
  coinId: "string",
  tenorId: "string",

  amount: "number",
  remainingAmount: "number",

  startAt: "timestamp",
  expiresAt: "timestamp",

  status: "active | expired | exhausted | revoked",

  sourceTransactionId: "string | null",

  createdBy: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

export const TRANSFER_SCHEMA = {
  coinId: "string",

  fromWalletId: "string",
  toWalletId: "string",

  amount: "number",
  tenorId: "string",

  allocationId: "string",

  transactionId: "string | null",
  transactionHash: "string | null",
  etherscanUrl: "string | null",

  status: "pending | submitted | confirmed | failed",

  createdBy: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

export const TRANSACTION_SCHEMA = {
  type: "mint | transfer | swap | burn | refill | revoke",
  coinId: "string",

  amount: "number",

  fromWalletId: "string | null",
  toWalletId: "string | null",

  tenorId: "string | null",
  allocationId: "string | null",

  transactionHash: "string | null",
  etherscanUrl: "string | null",

  networkId: "string",

  status: "pending | submitted | confirmed | failed",

  createdBy: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

export const SWAP_SCHEMA = {
  fromCoinId: "string",
  toCoinId: "string",

  fromAmount: "number",
  toAmount: "number",

  fromWalletId: "string",
  toWalletId: "string",

  transactionId: "string | null",
  transactionHash: "string | null",
  etherscanUrl: "string | null",

  status: "pending | submitted | confirmed | failed",

  createdBy: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

export const BURN_REQUEST_SCHEMA = {
  coinId: "string",
  walletId: "string",

  amount: "number",

  allocationId: "string | null",

  reason: "string",

  requestedBy: "string",

  status: "pending | approved | rejected | executed",

  approvalId: "string | null",

  createdAt: "timestamp",
  updatedAt: "timestamp"
};

export const BURN_APPROVAL_SCHEMA = {
  burnRequestId: "string",

  approvedBy: "string",

  reauthenticated: "boolean",

  reauthenticatedAt: "timestamp | null",

  status: "approved | rejected",

  createdAt: "timestamp"
};

export const PROVIDER_SCHEMA = {
  name: "alchemy | infura | custom",
  networkId: "string",

  rpcUrl: "string",
  apiKeyConfigured: "boolean",

  active: "boolean",

  createdBy: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

export const AUDIT_LOG_SCHEMA = {
  actorUid: "string",
  actorRole: "super_admin | admin",

  action: "string",
  module: "string",

  resourceType: "string",
  resourceId: "string | null",

  result: "success | denied | failed",

  metadata: "map",

  createdAt: "timestamp"
};

export const NOTIFICATION_SCHEMA = {
  recipientUid: "string",

  type: "transaction | burn | security | system",

  title: "string",
  message: "string",

  relatedTransactionId: "string | null",

  read: "boolean",

  createdAt: "timestamp"
};

export const SETTINGS_SCHEMA = {
  key: "string",
  value: "map | string | number | boolean",

  updatedBy: "string",
  updatedAt: "timestamp"
};


// Stage #22 — Swap Pair CRUD
export const SWAP_PAIRS_COLLECTION = 'swap_pairs';


// Stage #23 — Provider Management
export const PROVIDERS_COLLECTION = 'providers';


// Stage #24 — Network Management
export const NETWORK_SCHEMA = {
  name: "string",
  chainId: "number",
  nativeCurrency: "string",
  explorerUrl: "string",
  active: "boolean",
  isDefault: "boolean",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

export const NETWORKS_COLLECTION = 'networks';

export const TRANSACTION_VERIFICATIONS_COLLECTION = 'transactionVerifications';
export const CONTROLLER_TX_COLLECTION = 'controllerTx';
export const CONTROLLER_TX_HASHES_COLLECTION = 'controllerTxHashes';
export const CONTROLLER_TX_HISTORY_COLLECTION = 'controllerTxHistory';
export const REFILLS_COLLECTION = 'refills';

export const GAS_FEES_COLLECTION = 'gasFees';

export const SWAPS_COLLECTION = 'swaps';
