export function buildSwapPairAudit({
  action,
  pair,
  user,
  previousStatus = null,
}) {
  return {
    module: 'Swap Pair',
    action,

    pairId: pair?.id || null,

    baseCoin: pair?.baseCoin || null,
    quoteCoin: pair?.quoteCoin || null,

    networkId: pair?.networkId || null,

    dex: pair?.dex || null,

    status: pair?.status || null,
    previousStatus,

    userId: user?.id || null,
    role: user?.role || null,

    timestamp:
      new Date().toISOString(),
  };
}
