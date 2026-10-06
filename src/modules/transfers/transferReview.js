export function buildTransferReview({
  coin,
  wallet,
  tenor,
  amount
}) {
  if (!coin) {
    throw new Error(
      "Coin tidak ditemukan."
    );
  }

  if (!wallet) {
    throw new Error(
      "Destination wallet tidak ditemukan."
    );
  }

  if (!tenor) {
    throw new Error(
      "Tenor tidak ditemukan."
    );
  }

  if (
    wallet.type !==
    "destination"
  ) {
    throw new Error(
      "Transfer hanya dapat menggunakan destination wallet."
    );
  }

  if (wallet.active !== true) {
    throw new Error(
      "Destination wallet tidak aktif."
    );
  }

  if (coin.active !== true) {
    throw new Error(
      "Coin tidak aktif."
    );
  }

  if (tenor.active !== true) {
    throw new Error(
      "Tenor tidak aktif."
    );
  }

  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(
      numericAmount
    ) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "Amount transfer tidak valid."
    );
  }

  return {
    coin: {
      id: coin.id,
      symbol:
        coin.symbol ?? coin.name
    },

    destination: {
      id: wallet.id,
      name: wallet.name,
      address: wallet.address,
      networkId:
        wallet.networkId
    },

    tenor: {
      id: tenor.id,
      name: tenor.name,
      days: Number(tenor.days)
    },

    amount:
      numericAmount,

    reviewRequired:
      true
  };
}
