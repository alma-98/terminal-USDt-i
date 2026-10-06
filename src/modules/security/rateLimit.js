import {
  SECURITY_LIMITS,
} from './securityConfig.js';

export function createRateLimiter({
  maxRequests =
    SECURITY_LIMITS.RATE_LIMIT_MAX_REQUESTS,
  windowMs =
    SECURITY_LIMITS.RATE_LIMIT_WINDOW_MS,
} = {}) {
  const buckets = new Map();

  return {
    check(key) {
      const now = Date.now();
      const current = buckets.get(key);

      if (
        !current ||
        now - current.startedAt >= windowMs
      ) {
        buckets.set(key, {
          startedAt: now,
          count: 1,
        });

        return {
          allowed: true,
          remaining: maxRequests - 1,
        };
      }

      current.count += 1;

      if (current.count > maxRequests) {
        return {
          allowed: false,
          remaining: 0,
        };
      }

      return {
        allowed: true,
        remaining: maxRequests - current.count,
      };
    },

    clear() {
      buckets.clear();
    },
  };
}
