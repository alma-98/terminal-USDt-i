/**
 * Burn Approval Re-authentication
 *
 * Password hanya dipakai saat proses verifikasi.
 * Jangan simpan password plaintext ke frontend, localStorage,
 * Firestore, URL, audit log, atau Git.
 */

export function validateReauthInput(input = {}) {
  if (!input.password || String(input.password).length === 0) {
    return {
      valid: false,
      error: 'Password re-authentication wajib diisi',
    };
  }

  return {
    valid: true,
    error: null,
  };
}

export function createReauthPayload(password) {
  const validation = validateReauthInput({ password });

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return {
    password: String(password),
    purpose: 'BURN_APPROVAL',
  };
}
