export function calculateExpiresAt(
  startAt,
  tenorDays
) {
  const start = new Date(startAt);

  if (Number.isNaN(start.getTime())) {
    throw new Error(
      "startAt tidak valid."
    );
  }

  const days = Number(tenorDays);

  if (
    !Number.isInteger(days) ||
    days <= 0 ||
    days > 3650
  ) {
    throw new Error(
      "tenorDays harus integer antara 1 dan 3650."
    );
  }

  const expires =
    new Date(start);

  expires.setUTCDate(
    expires.getUTCDate() + days
  );

  return expires;
}

export function getExpiryStatus(
  expiresAt,
  now = new Date()
) {
  const expiry =
    new Date(expiresAt);

  if (
    Number.isNaN(
      expiry.getTime()
    )
  ) {
    return "invalid";
  }

  return expiry.getTime() <=
    now.getTime()
    ? "expired"
    : "active";
}

export function calculateAllocationExpiry({
  startAt,
  tenorDays
}) {
  const expiresAt =
    calculateExpiresAt(
      startAt,
      tenorDays
    );

  return {
    startAt:
      new Date(startAt),

    expiresAt,

    status:
      getExpiryStatus(
        expiresAt
      )
  };
}
