import {
  SECURITY_LIMITS,
} from './securityConfig.js';

export function createReauthSession({
  userId,
  verifiedAt = Date.now(),
}) {
  if (!userId) {
    throw new Error('REAUTH_USER_REQUIRED');
  }

  return Object.freeze({
    userId,
    verifiedAt,
    expiresAt:
      verifiedAt +
      SECURITY_LIMITS.REAUTH_WINDOW_MS,
  });
}

export function isReauthValid(
  session,
  userId,
  now = Date.now()
) {
  if (!session || !userId) {
    return false;
  }

  return (
    session.userId === userId &&
    now <= session.expiresAt
  );
}

export function requireReauth(
  session,
  userId,
  now = Date.now()
) {
  if (!isReauthValid(session, userId, now)) {
    throw new Error('REAUTH_REQUIRED');
  }

  return true;
}
