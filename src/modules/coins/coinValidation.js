const SUPPORTED_TYPES = [
  "native",
  "token"
];

export function validateCoin(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Coin data tidak valid.");
  }

  const name = String(data.name ?? "").trim();
  const symbol = String(data.symbol ?? "").trim().toUpperCase();
  const networkId = String(data.networkId ?? "").trim();

  if (!name) {
    throw new Error("Nama coin wajib diisi.");
  }

  if (name.length > 100) {
    throw new Error("Nama coin maksimal 100 karakter.");
  }

  if (!symbol) {
    throw new Error("Symbol coin wajib diisi.");
  }

  if (!/^[A-Z0-9._-]{1,20}$/.test(symbol)) {
    throw new Error(
      "Symbol hanya boleh berisi A-Z, angka, titik, underscore atau dash."
    );
  }

  if (!networkId) {
    throw new Error("Network wajib dipilih.");
  }

  const type = data.type ?? "token";

  if (!SUPPORTED_TYPES.includes(type)) {
    throw new Error("Tipe coin tidak valid.");
  }

  const decimals = Number(data.decimals);

  if (
    !Number.isInteger(decimals) ||
    decimals < 0 ||
    decimals > 36
  ) {
    throw new Error("Decimals harus integer 0-36.");
  }

  let contractAddress = null;

  if (data.contractAddress) {
    contractAddress = String(
      data.contractAddress
    ).trim();

    if (
      !/^0x[a-fA-F0-9]{40}$/.test(
        contractAddress
      )
    ) {
      throw new Error(
        "Contract address harus alamat EVM 0x + 40 hexadecimal."
      );
    }
  }

  if (
    type === "token" &&
    !contractAddress
  ) {
    throw new Error(
      "Token harus memiliki contract address."
    );
  }

  return {
    name,
    symbol,
    networkId,
    type,
    decimals,
    contractAddress,
    active:
      data.active === undefined
        ? true
        : Boolean(data.active),

    paused:
      data.paused === undefined
        ? false
        : Boolean(data.paused)
  };
}

export function normalizeCoin(data) {
  return validateCoin(data);
}
