export async function getWalletAccounts() {
  if (!window.ethereum) {
    throw new Error(
      'Wallet extension tidak ditemukan.',
    );
  }

  return window.ethereum.request({
    method: 'eth_requestAccounts',
  });
}

export async function getWalletChainId() {
  if (!window.ethereum) {
    throw new Error(
      'Wallet extension tidak ditemukan.',
    );
  }

  return window.ethereum.request({
    method: 'eth_chainId',
  });
}

export async function sendOnChainTransaction({
  from,
  to,
  value = '0x0',
  data = '0x',
}) {
  if (!window.ethereum) {
    throw new Error(
      'Wallet extension tidak ditemukan.',
    );
  }

  if (!from) {
    throw new Error('Wallet address wajib tersedia.');
  }

  if (!to) {
    throw new Error(
      'Destination address wajib tersedia.',
    );
  }

  /*
   * eth_sendTransaction meminta wallet extension
   * melakukan signing dan broadcast transaksi.
   *
   * TX hash yang dikembalikan adalah hash transaksi
   * hasil broadcast jaringan.
   */
  const txHash =
    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to,
          value,
          data,
        },
      ],
    });

  return txHash;
}
