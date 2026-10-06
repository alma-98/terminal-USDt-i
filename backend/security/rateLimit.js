export function createServerRateLimiter({
  maxRequests = 60,
  windowMs = 60 * 1000,
} = {}) {
  const buckets = new Map();

  return {
    check(key) {
      const now = Date.now();
      const bucket = buckets.get(key);

      if (
        !bucket ||
        now - bucket.startedAt >= windowMs
      ) {
        buckets.set(key, {
          startedAt: now,
          count: 1,
        });

        return true;
      }

      bucket.count += 1;

      return bucket.count <= maxRequests;
    },

    clear() {
      buckets.clear();
    },
  };
}
