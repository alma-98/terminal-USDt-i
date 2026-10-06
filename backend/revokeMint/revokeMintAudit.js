export function createRevokeMintAudit({
  actor,
  coinId,
  mode,
  oldState,
  newState,
  txHash = null,
}) {
  return {
    action: 'Revoke Mint',
    entity: 'coin',
    coinId,
    mode,
    oldState,
    newState,
    userId: actor?.userId || null,
    role: actor?.role || null,
    txHash,
    timestamp: new Date().toISOString(),
  };
}
