import {
  requireSignedIn,
  requireSuperAdmin,
} from '../auth/authorization.js';

export function adminFeeEndpoint(request) {
  /*
   * Admin hanya boleh memperoleh informasi fee
   * yang sudah disanitasi.
   */
  return requireSignedIn(request);
}

export function internalRecipientEndpoint(request) {
  /*
   * Endpoint recipient internal hanya Super Admin.
   */
  return requireSuperAdmin(request);
}

export function backendConfigurationEndpoint(request) {
  /*
   * Tidak tersedia untuk Admin.
   */
  return requireSuperAdmin(request);
}
