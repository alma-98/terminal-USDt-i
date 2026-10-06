export function requireString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} must be a non-empty string`);
  }

  return value.trim();
}

export function requirePositiveNumber(value, field) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    throw new Error(`${field} must be a positive number`);
  }

  return value;
}

export function requireNonNegativeNumber(value, field) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new Error(`${field} must be a non-negative number`);
  }

  return value;
}

export function requireInteger(value, field) {
  if (!Number.isInteger(value)) {
    throw new Error(`${field} must be an integer`);
  }

  return value;
}

export function requirePositiveInteger(value, field) {
  requireInteger(value, field);

  if (value <= 0) {
    throw new Error(`${field} must be greater than zero`);
  }

  return value;
}

export function requireOneOf(value, field, values) {
  if (!values.includes(value)) {
    throw new Error(
      `${field} must be one of: ${values.join(", ")}`
    );
  }

  return value;
}

export function validateAllocation(data) {
  requireString(data.walletId, "walletId");
  requireString(data.coinId, "coinId");
  requireString(data.tenorId, "tenorId");

  requirePositiveNumber(data.amount, "amount");
  requireNonNegativeNumber(
    data.remainingAmount,
    "remainingAmount"
  );

  if (data.remainingAmount > data.amount) {
    throw new Error(
      "remainingAmount cannot exceed amount"
    );
  }

  requireString(data.createdBy, "createdBy");

  return true;
}

export function validateTransfer(data) {
  requireString(data.coinId, "coinId");
  requireString(data.fromWalletId, "fromWalletId");
  requireString(data.toWalletId, "toWalletId");
  requireString(data.tenorId, "tenorId");

  requirePositiveNumber(data.amount, "amount");
  requireString(data.createdBy, "createdBy");

  if (data.fromWalletId === data.toWalletId) {
    throw new Error(
      "fromWalletId and toWalletId cannot be identical"
    );
  }

  return true;
}
