import {
  useState
} from "react";

import {
  createTransfer,
  confirmTransfer,
  cancelTransfer
} from "../../modules/transfers/transferService.js";

import {
  buildTransferReview
} from "../../modules/transfers/transferReview.js";

export default function TransferCreate({
  user,
  coins = [],
  wallets = [],
  tenors = []
}) {
  const [
    coinId,
    setCoinId
  ] = useState("");

  const [
    walletId,
    setWalletId
  ] = useState("");

  const [
    tenorId,
    setTenorId
  ] = useState("");

  const [
    amount,
    setAmount
  ] = useState("");

  const [
    review,
    setReview
  ] = useState(null);

  const [
    transferId,
    setTransferId
  ] = useState(null);

  const [
    error,
    setError
  ] = useState("");

  const [
    success,
    setSuccess
  ] = useState("");

  const selectedCoin =
    coins.find(
      (item) =>
        item.id === coinId
    );

  const selectedWallet =
    wallets.find(
      (item) =>
        item.id === walletId
    );

  const selectedTenor =
    tenors.find(
      (item) =>
        item.id === tenorId
    );

  function buildReview() {
    try {
      setError("");
      setSuccess("");

      const result =
        buildTransferReview({
          coin:
            selectedCoin,

          wallet:
            selectedWallet,

          tenor:
            selectedTenor,

          amount:
            Number(amount)
        });

      setReview(result);
    } catch (err) {
      setError(
        err?.message ||
        "Review transfer gagal."
      );
    }
  }

  async function createDraft() {
    try {
      setError("");
      setSuccess("");

      const result =
        await createTransfer({
          data: {
            coinId,
            destinationWalletId:
              walletId,
            tenorId,
            amount:
              Number(amount)
          },

          user
        });

      setTransferId(
        result.transferId
      );

      setSuccess(
        "Transfer dibuat dan menunggu konfirmasi."
      );

      setReview(
        null
      );
    } catch (err) {
      setError(
        err?.message ||
        "Gagal membuat transfer."
      );
    }
  }

  async function confirm() {
    try {
      setError("");
      setSuccess("");

      if (!transferId) {
        throw new Error(
          "Transfer ID belum tersedia."
        );
      }

      await confirmTransfer(
        transferId,
        user
      );

      setSuccess(
        "Transfer dikonfirmasi dan masuk status pending."
      );
    } catch (err) {
      setError(
        err?.message ||
        "Konfirmasi transfer gagal."
      );
    }
  }

  async function cancel() {
    try {
      setError("");
      setSuccess("");

      if (!transferId) {
        throw new Error(
          "Transfer ID belum tersedia."
        );
      }

      await cancelTransfer(
        transferId,
        user
      );

      setSuccess(
        "Transfer dibatalkan."
      );
    } catch (err) {
      setError(
        err?.message ||
        "Pembatalan gagal."
      );
    }
  }

  return (
    <section className="dashboard-panel">

      <div className="tenor-header">
        <div>
          <span className="eyebrow">
            TRANSFER
          </span>

          <h2>
            Transfer Coin
          </h2>
        </div>
      </div>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {success && (
        <div className="success-box">
          {success}
        </div>
      )}

      <div className="tenor-form">

        <label>
          Coin

          <select
            value={coinId}
            onChange={(event) =>
              setCoinId(
                event.target.value
              )
            }
          >
            <option value="">
              Pilih Coin
            </option>

            {coins
              .filter(
                (item) =>
                  item.active === true
              )
              .map(
                (coin) => (
                  <option
                    key={coin.id}
                    value={coin.id}
                  >
                    {coin.symbol ??
                      coin.name}
                  </option>
                )
              )}
          </select>
        </label>

        <label>
          Destination Wallet

          <select
            value={walletId}
            onChange={(event) =>
              setWalletId(
                event.target.value
              )
            }
          >
            <option value="">
              Pilih Destination
            </option>

            {wallets
              .filter(
                (item) =>
                  item.type ===
                    "destination" &&
                  item.active === true
              )
              .map(
                (wallet) => (
                  <option
                    key={wallet.id}
                    value={wallet.id}
                  >
                    {wallet.name}
                  </option>
                )
              )}
          </select>
        </label>

        <label>
          Amount

          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(event) =>
              setAmount(
                event.target.value
              )
            }
            placeholder="0.00"
          />
        </label>

        <label>
          Tenor

          <select
            value={tenorId}
            onChange={(event) =>
              setTenorId(
                event.target.value
              )
            }
          >
            <option value="">
              Pilih Tenor
            </option>

            {tenors
              .filter(
                (item) =>
                  item.active === true
              )
              .map(
                (tenor) => (
                  <option
                    key={tenor.id}
                    value={tenor.id}
                  >
                    {tenor.name} —{" "}
                    {tenor.days} hari
                  </option>
                )
              )}
          </select>
        </label>

      </div>

      <div
        style={{
          marginTop: "18px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap"
        }}
      >
        <button
          type="button"
          className="secondary-button"
          onClick={buildReview}
        >
          Review Transfer
        </button>
      </div>

      {review && (
        <div
          className="dashboard-panel"
          style={{
            marginTop: "18px"
          }}
        >
          <span className="eyebrow">
            REVIEW
          </span>

          <h3>
            Periksa sebelum confirm
          </h3>

          <p>
            Coin:{" "}
            <strong>
              {review.coin.symbol}
            </strong>
          </p>

          <p>
            Destination:{" "}
            <strong>
              {review.destination.name}
            </strong>
          </p>

          <p>
            Address:{" "}
            <strong>
              {review.destination.address}
            </strong>
          </p>

          <p>
            Network:{" "}
            <strong>
              {review.destination.networkId}
            </strong>
          </p>

          <p>
            Amount:{" "}
            <strong>
              {review.amount}
            </strong>
          </p>

          <p>
            Tenor:{" "}
            <strong>
              {review.tenor.name}
            </strong>
          </p>

          <p>
            Durasi:{" "}
            <strong>
              {review.tenor.days} hari
            </strong>
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={createDraft}
          >
            Buat Transfer
          </button>
        </div>
      )}

      {transferId && (
        <div
          className="dashboard-panel"
          style={{
            marginTop: "18px"
          }}
        >
          <span className="eyebrow">
            CONFIRMATION
          </span>

          <h3>
            Transfer siap dikonfirmasi
          </h3>

          <p>
            Transfer ID:
            {" "}
            <strong>
              {transferId}
            </strong>
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <button
              type="button"
              className="primary-button"
              onClick={confirm}
            >
              Confirm Transfer
            </button>

            <button
              type="button"
              className="danger-button"
              onClick={cancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
