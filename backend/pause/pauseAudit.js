export function createPauseAudit({
  actor,
  mode,
  operation,
  oldState,
  newState,
  txHash = null,
}) {
  return {
    action: newState === 'PAUSED' ? 'Pause' : 'Unpause',
    entity: 'pause',
    mode,
    operation,
    oldState,
    newState,
    userId: actor?.userId || null,
    role: actor?.role || null,
    txHash,
    timestamp: new Date().toISOString(),
  };
}
