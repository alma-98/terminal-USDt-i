export function createSecurityEvent({
  userId,
  role,
  action,
  objectType = 'security',
  status = 'SUCCESS',
  reason = null,
}) {
  return Object.freeze({
    userId: userId || 'system',
    role: role || 'system',
    action,
    objectType,
    timestamp: new Date().toISOString(),
    oldValue: null,
    newValue: null,
    status,
    reason,
  });
}
