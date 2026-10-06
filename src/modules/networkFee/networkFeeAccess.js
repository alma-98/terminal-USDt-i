export function normalizeRole(role) {
  return String(role || '').trim().toUpperCase();
}

export function isAdmin(role) {
  return normalizeRole(role) === 'ADMIN';
}

export function isSuperAdmin(role) {
  return normalizeRole(role) === 'SUPER_ADMIN';
}

/*
 * Admin hanya mendapatkan informasi fee.
 * Recipient/deployer wallet adalah informasi internal.
 */
export function canViewNetworkFeeRecipient(role) {
  return isSuperAdmin(role);
}

export function canViewNetworkFeeInternalData(role) {
  return isSuperAdmin(role);
}
