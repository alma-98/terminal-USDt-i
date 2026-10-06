const TRANSFER_STATUSES = [
  "draft",
  "review",
  "pending",
  "submitted",
  "confirmed",
  "failed",
  "cancelled"
];

export function validateTransferInput(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Data transfer tidak valid.");
  }

  const coinId =
    String(data.coinId ?? "").trim();

  const destinationWalletId =
    String(
      data.destinationWalletId ?? ""
    ).trim();

  const tenorId =
    String(data.tenorId ?? "").trim();

  const amount =
    Number(data.amount);

  if (!coinId) {
    throw new Error(
      "Coin wajib dipilih."
    );
  }

  if (!destinationWalletId) {
    throw new Error(
      "Destination wallet wajib dipilih."
    );
  }

  if (!tenorId) {
    throw new Error(
      "Tenor wajib dipilih."
    );
  }

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new Error(
      "Amount harus lebih besar dari 0."
    );
  }

  return {
    coinId,
    destinationWalletId,
    tenorId,
    amount
  };
}

export function validateTransferStatus(
  status
) {
  if (
    !TRANSFER_STATUSES.includes(
      status
    )
  ) {
    throw new Error(
      `Status transfer tidak valid: ${status}`
    );
  }

  return true;
}
