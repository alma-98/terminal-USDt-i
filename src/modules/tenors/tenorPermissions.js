export const TENOR_PERMISSIONS = Object.freeze({
  READ: "tenor.read",
  CREATE: "tenor.create",
  UPDATE: "tenor.update",
  DELETE: "tenor.delete"
});

export function canManageTenors(
  user,
  permission
) {
  if (!user) {
    return false;
  }

  /*
   * Super Admin mempunyai akses penuh.
   */
  if (user.role === "super_admin") {
    return true;
  }

  /*
   * Admin harus memiliki permission
   * yang sesuai.
   */
  return Array.isArray(user.permissions)
    && user.permissions.includes(permission);
}

/*
 * Digunakan oleh Admin untuk mendapatkan
 * hanya tenor yang aktif.
 */
export function canSelectActiveTenor(
  user
) {
  if (!user) {
    return false;
  }

  return (
    user.role === "super_admin" ||
    (
      Array.isArray(user.permissions) &&
      user.permissions.includes(
        TENOR_PERMISSIONS.READ
      )
    )
  );
}
