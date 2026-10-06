export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin"
};

export function isSuperAdmin(role) {
  return role === ROLES.SUPER_ADMIN;
}

export function isAdmin(role) {
  return role === ROLES.ADMIN;
}

export function canAccess(role, allowedRoles = []) {
  return allowedRoles.includes(role);
}
