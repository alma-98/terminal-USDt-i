/**
 * Backend-only re-authentication.
 *
 * Implementasi production harus memanggil sistem auth/password-hash
 * yang sudah digunakan project.
 *
 * Password TIDAK disimpan dan TIDAK dikembalikan ke frontend.
 */

export async function verifyBurnReauthentication({
  role,
  password,
  verifyPasswordHash,
}) {
  if (role !== 'Super Admin') {
    return false;
  }

  if (!password || typeof verifyPasswordHash !== 'function') {
    return false;
  }

  return Boolean(await verifyPasswordHash(password));
}
