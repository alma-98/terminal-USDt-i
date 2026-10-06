export const ALLOCATION_EXPIRY_STATUS =
  Object.freeze({
    ACTIVE:
      "active",

    EXPIRED:
      "expired",

    REVOKED:
      "revoked"
  });

export function isAllocationExpired(
  allocation
) {
  if (!allocation?.expiresAt) {
    return false;
  }

  const expiry =
    allocation.expiresAt.toDate
      ? allocation.expiresAt.toDate()
      : new Date(
          allocation.expiresAt
        );

  return (
    expiry.getTime() <=
    Date.now()
  );
}
