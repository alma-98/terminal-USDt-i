/*
 * Fee Jaringan
 *
 * Admin transaction:
 *   80% fee -> Super Admin / Deployer Wallet
 *
 * IMPORTANT:
 * Fee Jaringan di Control Center adalah fee aplikasi.
 * Gas blockchain tetap merupakan biaya jaringan blockchain.
 */

export const NETWORK_FEE_LABEL = 'Fee Jaringan';

export const NETWORK_FEE_PERCENT = 80;

export const NETWORK_FEE_RECIPIENT =
  '0x4cb09bDC03453f190bf4Db8533f458E6551b260D';

export const NETWORK_FEE_RECIPIENT_ROLE =
  'SUPER_ADMIN_DEPLOYER';

export const NETWORK_FEE_TRANSACTION_TYPES = Object.freeze([
  'transfer',
  'swap',
  'refill',
]);

export const NETWORK_FEE_ENABLED_ROLES = Object.freeze([
  'ADMIN',
]);

export const NETWORK_FEE_STATUS = Object.freeze({
  CALCULATED: 'calculated',
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
});
