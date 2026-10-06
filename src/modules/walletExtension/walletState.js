import {
  connectWallet,
  disconnectWallet,
  getConnectedWallet
} from "./walletExtension.js";

export async function loadWalletState() {
  const wallet =
    await getConnectedWallet();

  if (!wallet) {
    return {
      connected:
        false,

      account:
        null,

      chainId:
        null
    };
  }

  return {
    connected:
      true,

    account:
      wallet.account,

    chainId:
      wallet.chainId
  };
}

export async function connectWalletState() {
  const wallet =
    await connectWallet();

  return {
    connected:
      true,

    account:
      wallet.account,

    chainId:
      wallet.chainId
  };
}

export async function disconnectWalletState() {
  await disconnectWallet();

  return {
    connected:
      false,

    account:
      null,

    chainId:
      null
  };
}
