import { ROLES } from './securityConfig.js';

export function isValidRole(role) {
  return ROLES.includes(role);
}

export function requireRole(user, allowedRoles = []) {
  if (!user || !isValidRole(user.role)) {
    throw new Error('UNAUTHORIZED');
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    throw new Error('FORBIDDEN');
  }

  return true;
}

export function requireSuperAdmin(user) {
  return requireRole(user, ['Super Admin']);
}
