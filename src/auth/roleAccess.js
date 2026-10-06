import {
  ROLE_PERMISSIONS,
  hasPermission,
  getRolePermissions
} from "./permissionMatrix.js";

export function isValidRole(role) {
  return Object.prototype.hasOwnProperty.call(
    ROLE_PERMISSIONS,
    role
  );
}

export function getUserAccess(user) {
  if (!user || !isValidRole(user.role)) {
    return {
      role: null,
      permissions: {}
    };
  }

  return {
    role: user.role,
    permissions: getRolePermissions(user.role)
  };
}

export function can(user, module, action) {
  if (!user) {
    return false;
  }

  return hasPermission(user.role, module, action);
}
