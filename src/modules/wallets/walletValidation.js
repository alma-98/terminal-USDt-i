const WALLET_TYPES = [
  "deployer",
  "admin",
  "destination"
];

const EVM_NETWORKS = [
  "ethereum",
  "sepolia",
  "bsc",
  "bsc-testnet",
  "polygon",
  "amoy",
  "arbitrum",
  "optimism",
  "base",
  "custom"
];

export function validateWallet(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Wallet data tidak valid.");
  }

  const name =
    String(data.name ?? "").trim();

  const address =
    String(data.address ?? "").trim();

  const type =
    String(data.type ?? "").trim();

  const networkId =
    String(data.networkId ?? "").trim();

  if (!name) {
    throw new Error(
      "Nama wallet wajib diisi."
    );
  }

  if (name.length > 100) {
    throw new Error(
      "Nama wallet maksimal 100 karakter."
    );
  }

  if (!address) {
    throw new Error(
      "Wallet address wajib diisi."
    );
  }

  /*
   * Wallet address EVM.
   *
   * Tahap ini hanya menyimpan public address.
   * Tidak menyimpan private key atau seed phrase.
   */
  if (
    !/^0x[a-fA-F0-9]{40}$/.test(address)
  ) {
    throw new Error(
      "Wallet address harus alamat EVM yang valid."
    );
  }

  if (!WALLET_TYPES.includes(type)) {
    throw new Error(
      "Wallet type harus deployer, admin, atau destination."
    );
  }

  if (!EVM_NETWORKS.includes(networkId)) {
    throw new Error(
      "Network wallet tidak didukung."
    );
  }

  const ownerUid =
    data.ownerUid
      ? String(data.ownerUid).trim()
      : null;

  return {
    name,
    address,
    type,
    networkId,
    ownerUid,

    active:
      data.active === undefined
        ? true
        : Boolean(data.active)
  };
}

export function isDeployerWallet(
  wallet
) {
  return wallet?.type === "deployer";
}

export function isAdminWallet(
  wallet
) {
  return wallet?.type === "admin";
}

export function isDestinationWallet(
  wallet
) {
  return wallet?.type === "destination";
}
