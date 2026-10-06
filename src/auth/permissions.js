export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin"
};

export const PERMISSIONS = {
  COIN_READ: "coin.read",
  COIN_CREATE: "coin.create",
  COIN_UPDATE: "coin.update",
  COIN_DELETE: "coin.delete",

  TENOR_READ: "tenor.read",
  TENOR_CREATE: "tenor.create",
  TENOR_UPDATE: "tenor.update",
  TENOR_DELETE: "tenor.delete",

  DEPLOYER_WALLET_READ: "deployer_wallet.read",

  ADMIN_WALLET_READ: "admin_wallet.read",
  ADMIN_WALLET_CREATE: "admin_wallet.create",
  ADMIN_WALLET_UPDATE: "admin_wallet.update",
  ADMIN_WALLET_DELETE: "admin_wallet.delete",

  DESTINATION_WALLET_READ: "destination_wallet.read",
  DESTINATION_WALLET_CREATE: "destination_wallet.create",
  DESTINATION_WALLET_UPDATE: "destination_wallet.update",
  DESTINATION_WALLET_DELETE: "destination_wallet.delete",

  TRANSFER_CREATE: "transfer.create",
  TRANSFER_READ: "transfer.read",

  HASH_READ: "hash.read",
  HASH_CREATE: "hash.create",
  HASH_UPDATE: "hash.update",

  SWAP_READ: "swap.read",
  SWAP_CREATE: "swap.create",

  BURN_REQUEST_CREATE: "burn_request.create",
  BURN_REQUEST_READ: "burn_request.read",

  AUDIT_READ: "audit.read"
};

export const SUPER_ADMIN_PERMISSIONS = Object.values(PERMISSIONS);

export const DEFAULT_ADMIN_PERMISSIONS = [
  PERMISSIONS.COIN_READ,

  PERMISSIONS.ADMIN_WALLET_READ,

  PERMISSIONS.DESTINATION_WALLET_READ,
  PERMISSIONS.DESTINATION_WALLET_CREATE,
  PERMISSIONS.DESTINATION_WALLET_UPDATE,

  PERMISSIONS.TRANSFER_CREATE,
  PERMISSIONS.TRANSFER_READ,

  PERMISSIONS.HASH_READ,
  PERMISSIONS.HASH_CREATE,

  PERMISSIONS.SWAP_READ,
  PERMISSIONS.SWAP_CREATE,

  PERMISSIONS.BURN_REQUEST_CREATE,
  PERMISSIONS.BURN_REQUEST_READ,

  PERMISSIONS.AUDIT_READ
];

export function hasPermission(user, permission) {
  if (!user) {
    return false;
  }

  if (user.role === ROLES.SUPER_ADMIN) {
    return true;
  }

  return Array.isArray(user.permissions)
    && user.permissions.includes(permission);
}

export function hasAnyPermission(user, permissions = []) {
  return permissions.some((permission) =>
    hasPermission(user, permission)
  );
}

export function hasAllPermissions(user, permissions = []) {
  return permissions.every((permission) =>
    hasPermission(user, permission)
  );
}
