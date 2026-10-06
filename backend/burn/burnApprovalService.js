import { verifyBurnReauthentication } from './burnReauthService.js';

export async function processBurnApproval({
  request,
  actor,
  password,
  verifyPasswordHash,
}) {
  if (actor?.role !== 'Super Admin') {
    const error = new Error('FORBIDDEN');
    error.code = 'FORBIDDEN';
    throw error;
  }

  if (request?.status !== 'PENDING') {
    throw new Error('Burn Request harus PENDING');
  }

  const verified = await verifyBurnReauthentication({
    role: actor.role,
    password,
    verifyPasswordHash,
  });

  if (!verified) {
    return {
      ...request,
      status: 'REJECTED',
      rejectionReason: 'RE-AUTHENTICATION_FAILED',
      rejectedAt: new Date().toISOString(),
      rejectedBy: actor.userId || null,
    };
  }

  return {
    ...request,
    status: 'APPROVED',
    approvedAt: new Date().toISOString(),
    approvedBy: actor.userId || null,
    approvedByRole: 'Super Admin',
  };
}
