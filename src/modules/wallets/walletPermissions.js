export const WALLET_PERMISSIONS =
  Object.freeze({
    READ:
      "wallet.read",

    CREATE:
      "wallet.create",

    UPDATE:
      "wallet.update",

    DELETE:
      "wallet.delete",

    DEPLOYER_READ:
      "deployer_wallet.read",

    DEPLOYER_CREATE:
      "deployer_wallet.create",

    DEPLOYER_UPDATE:
      "deployer_wallet.update",

    DEPLOYER_DELETE:
      "deployer_wallet.delete",

    ADMIN_READ:
      "admin_wallet.read",

    ADMIN_CREATE:
      "admin_wallet.create",

    ADMIN_UPDATE:
      "admin_wallet.update",

    ADMIN_DELETE:
      "admin_wallet.delete",

    DESTINATION_READ:
      "destination_wallet.read",

    DESTINATION_CREATE:
      "destination_wallet.create",

    DESTINATION_UPDATE:
      "destination_wallet.update",

    DESTINATION_DELETE:
      "destination_wallet.delete"
  });

export function hasPermission(
  user,
  permission
) {
  if (!user) {
    return false;
  }

  if (
    user.role === "super_admin"
  ) {
    return true;
  }

  return (
    Array.isArray(user.permissions) &&
    user.permissions.includes(permission)
  );
}

export function canReadWalletType(
  user,
  type
) {
  if (
    user?.role === "super_admin"
  ) {
    return true;
  }

  const map = {
    deployer:
      WALLET_PERMISSIONS
        .DEPLOYER_READ,

    admin:
      WALLET_PERMISSIONS
        .ADMIN_READ,

    destination:
      WALLET_PERMISSIONS
        .DESTINATION_READ
  };

  return hasPermission(
    user,
    map[type]
  );
}

export function canCreateWalletType(
  user,
  type
) {
  if (
    user?.role === "super_admin"
  ) {
    return true;
  }

  const map = {
    deployer:
      WALLET_PERMISSIONS
        .DEPLOYER_CREATE,

    admin:
      WALLET_PERMISSIONS
        .ADMIN_CREATE,

    destination:
      WALLET_PERMISSIONS
        .DESTINATION_CREATE
  };

  return hasPermission(
    user,
    map[type]
  );
}

export function canUpdateWalletType(
  user,
  type
) {
  if (
    user?.role === "super_admin"
  ) {
    return true;
  }

  const map = {
    deployer:
      WALLET_PERMISSIONS
        .DEPLOYER_UPDATE,

    admin:
      WALLET_PERMISSIONS
        .ADMIN_UPDATE,

    destination:
      WALLET_PERMISSIONS
        .DESTINATION_UPDATE
  };

  return hasPermission(
    user,
    map[type]
  );
}

export function canDeleteWalletType(
  user,
  type
) {
  if (
    user?.role === "super_admin"
  ) {
    return true;
  }

  const map = {
    deployer:
      WALLET_PERMISSIONS
        .DEPLOYER_DELETE,

    admin:
      WALLET_PERMISSIONS
        .ADMIN_DELETE,

    destination:
      WALLET_PERMISSIONS
        .DESTINATION_DELETE
  };

  return hasPermission(
    user,
    map[type]
  );
}
