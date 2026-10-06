export const COIN_PERMISSIONS = Object.freeze({
  READ: "coin.read",
  CREATE: "coin.create",
  UPDATE: "coin.update",
  DELETE: "coin.delete"
});

export function canManageCoins(
  user,
  permission
) {
  if (!user) {
    return false;
  }

  if (user.role === "super_admin") {
    return true;
  }

  return Array.isArray(
    user.permissions
  )
    && user.permissions.includes(
      permission
    );
}
