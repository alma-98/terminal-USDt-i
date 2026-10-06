import {
  SENSITIVE_KEYS,
  SECURITY_LIMITS,
} from './securityConfig.js';

function containsSensitiveKey(value, path = '') {
  if (!value || typeof value !== 'object') {
    return false;
  }

  for (const [key, child] of Object.entries(value)) {
    const normalized = key
      .replace(/[-\s]/g, '_')
      .toLowerCase();

    if (
      SENSITIVE_KEYS.some(
        (sensitive) =>
          normalized === sensitive.toLowerCase()
      )
    ) {
      return true;
    }

    if (
      child &&
      typeof child === 'object' &&
      containsSensitiveKey(
        child,
        `${path}.${key}`
      )
    ) {
      return true;
    }
  }

  return false;
}

export function validateSafePayload(payload) {
  const serialized = JSON.stringify(payload ?? null);

  if (
    Buffer.byteLength(serialized, 'utf8') >
    SECURITY_LIMITS.MAX_REQUEST_BODY_BYTES
  ) {
    return {
      valid: false,
      reason: 'PAYLOAD_TOO_LARGE',
    };
  }

  if (containsSensitiveKey(payload)) {
    return {
      valid: false,
      reason: 'SENSITIVE_SECRET_FIELD',
    };
  }

  return {
    valid: true,
    reason: null,
  };
}

export function validateFieldLength(value) {
  if (value === undefined || value === null) {
    return true;
  }

  return String(value).length <=
    SECURITY_LIMITS.MAX_FIELD_LENGTH;
}

export function containsSecretKey(payload) {
  return containsSensitiveKey(payload);
}
