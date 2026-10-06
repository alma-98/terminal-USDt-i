export const TRANSFER_PERMISSIONS =
  Object.freeze({
    READ:
      "transfer.read",

    CREATE:
      "transfer.create",

    REVIEW:
      "transfer.review",

    CONFIRM:
      "transfer.confirm",

    CANCEL:
      "transfer.cancel"
  });

export function hasTransferPermission(
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
    user.permissions.includes(
      permission
    )
  );
}
