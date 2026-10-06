export function validateAllocationExpiry(
  data
) {
  if (!data) {
    throw new Error(
      "Allocation data tidak tersedia."
    );
  }

  if (!data.walletId) {
    throw new Error(
      "walletId wajib diisi."
    );
  }

  if (!data.coinId) {
    throw new Error(
      "coinId wajib diisi."
    );
  }

  if (!data.tenorId) {
    throw new Error(
      "tenorId wajib diisi."
    );
  }

  if (!data.startAt) {
    throw new Error(
      "startAt wajib diisi."
    );
  }

  if (
    !Number.isInteger(
      Number(data.tenorDays)
    ) ||
    Number(data.tenorDays) <= 0
  ) {
    throw new Error(
      "tenorDays tidak valid."
    );
  }

  if (!data.expiresAt) {
    throw new Error(
      "expiresAt wajib tersedia."
    );
  }

  return true;
}
