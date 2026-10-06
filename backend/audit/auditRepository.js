import {
  createAuditRecord,
} from './auditService.js';

/**
 * Repository hanya menyediakan CREATE.
 *
 * Read dapat dilakukan oleh layer query/auth yang sudah ada.
 * Tidak ada update/delete untuk audit_logs.
 */
export async function appendAuditEvent({
  db,
  event,
}) {
  const record = createAuditRecord(event);

  if (!db || typeof db.collection !== 'function') {
    throw new Error('Firestore database instance diperlukan');
  }

  await db
    .collection('audit_logs')
    .doc(record.id)
    .create(record);

  return record;
}
