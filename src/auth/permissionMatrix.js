export const ROLE_PERMISSIONS = {
  super_admin: {
    coin: ["read", "create", "update", "delete"],
    tenor: ["read", "create", "update", "delete"],
    deployer_wallet: ["read"],
    admin_wallet: ["read", "create", "update", "delete"],
    destination_wallet: ["read", "create", "update", "delete"],
    refill: ["read", "create"],
    transfer: ["read", "create"],
    hash: ["read", "create", "update"],
    swap: ["read", "create"],
    burn: ["read", "create", "approve"],
    pause: ["read", "create"],
    revoke_mint: ["read", "create"],
    provider: ["read", "create", "update", "delete"],
    admin_management: ["read", "create", "update", "delete"],
    audit: ["read"],
    system_settings: ["read", "update"]
  },

  admin: {
    coin: ["read"],
    tenor: [],
    deployer_wallet: [],
    admin_wallet: ["read"],
    destination_wallet: ["read", "create", "update"],
    refill: [],
    transfer: ["read", "create"],
    hash: ["read", "create"],
    swap: ["read", "create"],
    burn: ["read", "create"],
    pause: [],
    revoke_mint: [],
    provider: [],
    admin_management: [],
    audit: ["read"],
    system_settings: []
  }
};

export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || {};
}

export function hasPermission(role, module, action) {
  const permissions = getRolePermissions(role);
  const actions = permissions[module] || [];

  return actions.includes(action);
}

export function hasAnyPermission(role, module, actions = []) {
  return actions.some((action) =>
    hasPermission(role, module, action)
  );
}

export function hasAllPermissions(role, module, actions = []) {
  return actions.every((action) =>
    hasPermission(role, module, action)
  );
}
