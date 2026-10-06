import {
  ROLES,
  DEFAULT_ADMIN_PERMISSIONS,
  SUPER_ADMIN_PERMISSIONS
} from "./permissions.js";

export function normalizeUserRole(user) {
  if (!user) {
    return null;
  }

  if (user.role === ROLES.SUPER_ADMIN) {
    return {
      ...user,
      role: ROLES.SUPER_ADMIN,
      permissions: SUPER_ADMIN_PERMISSIONS
    };
  }

  if (user.role === ROLES.ADMIN) {
    return {
      ...user,
      role: ROLES.ADMIN,
      permissions: Array.isArray(user.permissions)
        ? user.permissions
        : DEFAULT_ADMIN_PERMISSIONS
    };
  }

  return {
    ...user,
    role: null,
    permissions: []
  };
}
