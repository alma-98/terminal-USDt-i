import { createReauthPayload } from './burnReauth.js';

export async function approveBurnWithReauth({
  request,
  password,
  verifyReauth,
  audit,
}) {
  if (!request || request.status !== 'PENDING') {
    throw new Error('Burn Request harus berstatus PENDING');
  }

  if (request.requestedByRole === 'Super Admin') {
    // Tetap membutuhkan re-authentication untuk aksi sensitif.
  }

  const reauthPayload = createReauthPayload(password);

  const verified = await verifyReauth(reauthPayload);

  if (!verified) {
    await audit?.({
      action: 'Burn Approval',
      result: 'REJECTED',
      reason: 'RE-AUTHENTICATION_FAILED',
      requestId: request.id || null,
    });

    throw new Error('Re-authentication gagal');
  }

  const approved = {
    ...request,
    status: 'APPROVED',
    approvedAt: new Date().toISOString(),
    approvedByRole: 'Super Admin',
  };

  await audit?.({
    action: 'Burn Approval',
    result: 'APPROVED',
    requestId: request.id || null,
  });

  return approved;
}

export async function rejectBurnWithReauth({
  request,
  password,
  reason,
  verifyReauth,
  audit,
}) {
  if (!request || request.status !== 'PENDING') {
    throw new Error('Burn Request harus berstatus PENDING');
  }

  if (!reason || !String(reason).trim()) {
    throw new Error('Alasan reject wajib diisi');
  }

  const reauthPayload = createReauthPayload(password);

  const verified = await verifyReauth(reauthPayload);

  if (!verified) {
    await audit?.({
      action: 'Burn Reject',
      result: 'REJECTED',
      reason: 'RE-AUTHENTICATION_FAILED',
      requestId: request.id || null,
    });

    throw new Error('Re-authentication gagal');
  }

  const rejected = {
    ...request,
    status: 'REJECTED',
    rejectedAt: new Date().toISOString(),
    rejectedByRole: 'Super Admin',
    rejectionReason: String(reason).trim(),
  };

  await audit?.({
    action: 'Burn Reject',
    result: 'REJECTED',
    requestId: request.id || null,
    rejectionReason: String(reason).trim(),
  });

  return rejected;
}
