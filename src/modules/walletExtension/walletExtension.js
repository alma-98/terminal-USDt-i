const ETHEREUM_PROVIDER_KEY = "ethereum";

export function getWalletProvider() {
  if (
    typeof window === "undefined" ||
    !window[ETHEREUM_PROVIDER_KEY]
  ) {
    return null;
  }

  return window[ETHEREUM_PROVIDER_KEY];
}

export function isWalletAvailable() {
  return Boolean(
    getWalletProvider()
  );
}

export async function connectWallet() {
  const provider =
    getWalletProvider();

  if (!provider) {
    throw new Error(
      "Browser wallet extension tidak tersedia."
    );
  }

  const accounts =
    await provider.request({
      method:
        "eth_requestAccounts"
    });

  if (
    !Array.isArray(accounts) ||
    accounts.length === 0
  ) {
    throw new Error(
      "Tidak ada account wallet yang terhubung."
    );
  }

  const chainId =
    await provider.request({
      method:
        "eth_chainId"
    });

  return {
    account:
      accounts[0],

    chainId,

    provider
  };
}

export async function getConnectedWallet() {
  const provider =
    getWalletProvider();

  if (!provider) {
    return null;
  }

  const accounts =
    await provider.request({
      method:
        "eth_accounts"
    });

  if (
    !Array.isArray(accounts) ||
    accounts.length === 0
  ) {
    return null;
  }

  const chainId =
    await provider.request({
      method:
        "eth_chainId"
    });

  return {
    account:
      accounts[0],

    chainId,

    provider
  };
}

export async function getWalletChainId() {
  const provider =
    getWalletProvider();

  if (!provider) {
    return null;
  }

  return provider.request({
    method:
      "eth_chainId"
  });
}

export async function switchWalletChain(
  chainId
) {
  const provider =
    getWalletProvider();

  if (!provider) {
    throw new Error(
      "Browser wallet extension tidak tersedia."
    );
  }

  if (!chainId) {
    throw new Error(
      "chainId wajib diberikan."
    );
  }

  await provider.request({
    method:
      "wallet_switchEthereumChain",

    params: [
      {
        chainId
      }
    ]
  });

  return getConnectedWallet();
}

export async function disconnectWallet() {
  /*
   * Browser wallet biasanya tidak
   * menyediakan disconnect universal.
   *
   * Aplikasi hanya menghapus state
   * koneksi lokal.
   */
  return true;
}

/*
 * Membuat EIP-1193 request helper.
 */
export async function walletRequest(
  method,
  params = []
) {
  const provider =
    getWalletProvider();

  if (!provider) {
    throw new Error(
      "Browser wallet extension tidak tersedia."
    );
  }

  return provider.request({
    method,
    params
  });
}

/*
 * Meminta wallet melakukan signature.
 *
 * Private key tetap berada di wallet extension.
 */
export async function signMessage(
  message
) {
  const wallet =
    await getConnectedWallet();

  if (!wallet) {
    throw new Error(
      "Wallet belum terhubung."
    );
  }

  return wallet.provider.request({
    method:
      "personal_sign",

    params: [
      message,
      wallet.account
    ]
  });
}

/*
 * Transaction confirmation.
 *
 * Fungsi ini hanya meminta wallet
 * menampilkan confirmation.
 *
 * Private key tidak pernah masuk
 * ke aplikasi.
 */
export async function requestTransactionConfirmation(
  transaction
) {
  const wallet =
    await getConnectedWallet();

  if (!wallet) {
    throw new Error(
      "Wallet belum terhubung."
    );
  }

  if (
    !transaction ||
    typeof transaction !==
      "object"
  ) {
    throw new Error(
      "Transaction tidak valid."
    );
  }

  return wallet.provider.request({
    method:
      "eth_sendTransaction",

    params: [
      {
        ...transaction,

        from:
          wallet.account
      }
    ]
  });
}
