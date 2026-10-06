import {
  ROLES,
  hasPermission
} from "./permissions.js";

export function requireRole(user, role) {
  if (!user) {
    return false;
  }

  return user.role === role;
}

export function requireSuperAdmin(user) {
  return requireRole(user, ROLES.SUPER_ADMIN);
}

export function requireAdmin(user) {
  return requireRole(user, ROLES.ADMIN);
}

export function requirePermission(user, permission) {
  return hasPermission(user, permission);
}
