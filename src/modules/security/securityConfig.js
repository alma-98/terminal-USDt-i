export const ROLES = Object.freeze([
  'Admin',
  'Super Admin',
]);

export const SENSITIVE_KEYS = Object.freeze([
  'privateKey',
  'private_key',
  'seedPhrase',
  'seed_phrase',
  'mnemonic',
  'apiSecret',
  'api_secret',
  'clientSecret',
  'client_secret',
  'password',
  'token',
]);

export const SECURITY_LIMITS = Object.freeze({
  MAX_REQUEST_BODY_BYTES: 256 * 1024,
  MAX_FIELD_LENGTH: 4096,
  RATE_LIMIT_WINDOW_MS: 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: 60,
  REAUTH_WINDOW_MS: 5 * 60 * 1000,
});
