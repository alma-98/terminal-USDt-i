export function createBurnApprovalAudit({
  request,
  actor,
  result,
  reason = null,
}) {
  return {
    action: 'Burn Approval',
    entity: 'burn_request',
    requestId: request?.id || null,
    result,
    userId: actor?.userId || null,
    role: actor?.role || null,
    reason,
    timestamp: new Date().toISOString(),

    // Jangan pernah memasukkan password/re-auth secret.
    password: undefined,
    reauthPassword: undefined,
  };
}

export function createBurnRejectAudit({
  request,
  actor,
  result,
  reason = null,
}) {
  return {
    action: 'Burn Reject',
    entity: 'burn_request',
    requestId: request?.id || null,
    result,
    userId: actor?.userId || null,
    role: actor?.role || null,
    reason,
    timestamp: new Date().toISOString(),

    password: undefined,
    reauthPassword: undefined,
  };
}
