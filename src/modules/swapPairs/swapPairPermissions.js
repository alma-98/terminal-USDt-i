export const SWAP_PAIR_PERMISSION = 'swap_pairs.manage';

export const SWAP_PAIR_ROLES = Object.freeze({
  SUPER_ADMIN: 'super_admin'
});

export function canManageSwapPairs(userRole) {
  return String(userRole || '').toLowerCase() === SWAP_PAIR_ROLES.SUPER_ADMIN;
}
