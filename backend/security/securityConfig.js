export const SECRET_ENV_NAMES = Object.freeze([
  'DEPLOYER_PRIVATE_KEY',
  'DEPLOYER_SEED_PHRASE',
  'SEED_PHRASE',
  'PRIVATE_KEY',
  'ALCHEMY_API_KEY',
  'INFURA_PROJECT_ID',
  'INFURA_API_SECRET',
]);

export const SECURITY_HEADERS = Object.freeze({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=()',
});
