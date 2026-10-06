function normalizeRole(role) {
  return String(role || '').trim().toUpperCase();
}

export function isAdmin(role) {
  return normalizeRole(role) === 'ADMIN';
}

export function isSuperAdmin(role) {
  return normalizeRole(role) === 'SUPER_ADMIN';
}

export function requireSignedIn(request) {
  if (!request?.user) {
    const error = new Error('Authentication required.');
    error.statusCode = 401;
    throw error;
  }

  return request.user;
}

export function requireSuperAdmin(request) {
  const user = requireSignedIn(request);

  if (!isSuperAdmin(user.role)) {
    const error = new Error('Super Admin permission required.');
    error.statusCode = 403;
    throw error;
  }

  return user;
}

/*
 * Admin tidak pernah mendapatkan akses ke internal
 * backend configuration atau recipient internal.
 */
export function denyBackendInternals(request) {
  const user = requireSignedIn(request);

  if (isAdmin(user.role)) {
    const error = new Error('Backend internal access denied.');
    error.statusCode = 403;
    throw error;
  }

  return user;
}
