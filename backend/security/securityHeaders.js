import {
  SECURITY_HEADERS,
} from './securityConfig.js';

export function applySecurityHeaders(
  responseHeaders
) {
  for (const [key, value] of Object.entries(
    SECURITY_HEADERS
  )) {
    responseHeaders.set(key, value);
  }

  return responseHeaders;
}
