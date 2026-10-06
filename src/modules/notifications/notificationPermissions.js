export const NOTIFICATION_PERMISSIONS =
  Object.freeze({
    READ:
      "notification.read",

    MARK_READ:
      "notification.mark_read"
  });

export function canReadNotification(
  user
) {
  return Boolean(
    user &&
    user.role ===
      "super_admin"
  );
}

export function canMarkNotificationRead(
  user
) {
  return Boolean(
    user &&
    user.role ===
      "super_admin"
  );
}
