import {
  useEffect,
  useState
} from "react";

import {
  createCoin,
  deleteCoin,
  listCoins,
  setCoinActive,
  setCoinPaused,
  updateCoin
} from "../../modules/coins/coinService.js";

import {
  COIN_PERMISSIONS,
  canManageCoins
} from "../../modules/coins/coinPermissions.js";

const EMPTY_FORM = {
  name: "",
  symbol: "",
  networkId: "ethereum",
  type: "token",
  decimals: 18,
  contractAddress: "",
  active: true,
  paused: false
};

export default function CoinCrud({
  user
}) {
  const [
    coins,
    setCoins
  ] = useState([]);

  const [
    form,
    setForm
  ] = useState(EMPTY_FORM);

  const [
    editingId,
    setEditingId
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  const [
    success,
    setSuccess
  ] = useState("");

  const canRead =
    canManageCoins(
      user,
      COIN_PERMISSIONS.READ
    );

  const canCreate =
    canManageCoins(
      user,
      COIN_PERMISSIONS.CREATE
    );

  const canUpdate =
    canManageCoins(
      user,
      COIN_PERMISSIONS.UPDATE
    );

  const canDelete =
    canManageCoins(
      user,
      COIN_PERMISSIONS.DELETE
    );

  async function loadCoins() {
    try {
      setLoading(true);
      setError("");

      const result =
        await listCoins();

      setCoins(result);
    } catch (err) {
      setError(
        err?.message ||
        "Gagal mengambil data coin."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canRead) {
      loadCoins();
    } else {
      setLoading(false);
    }
  }, [canRead]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));
  }

  function editCoin(coin) {
    setEditingId(coin.id);

    setForm({
      name: coin.name ?? "",
      symbol: coin.symbol ?? "",
      networkId:
        coin.networkId ??
        "ethereum",
      type:
        coin.type ??
        "token",
      decimals:
        coin.decimals ?? 18,
      contractAddress:
        coin.contractAddress ??
        "",
      active:
        coin.active !== false,
      paused:
        coin.paused === true
    });

    setError("");
    setSuccess("");
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        decimals:
          Number(form.decimals)
      };

      if (editingId) {
        if (!canUpdate) {
          throw new Error(
            "Anda tidak memiliki permission untuk mengubah coin."
          );
        }

        await updateCoin(
          editingId,
          payload,
          user
        );

        setSuccess(
          "Coin berhasil diperbarui."
        );
      } else {
        if (!canCreate) {
          throw new Error(
            "Anda tidak memiliki permission untuk membuat coin."
          );
        }

        await createCoin(
          payload,
          user
        );

        setSuccess(
          "Coin berhasil dibuat."
        );
      }

      resetForm();
      await loadCoins();
    } catch (err) {
      setError(
        err?.message ||
        "Operasi coin gagal."
      );
    }
  }

  async function handleDelete(
    coin
  ) {
    if (!canDelete) {
      setError(
        "Anda tidak memiliki permission untuk menghapus coin."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Hapus coin ${coin.symbol}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCoin(
        coin.id,
        user
      );

      setSuccess(
        "Coin berhasil dihapus."
      );

      await loadCoins();
    } catch (err) {
      setError(
        err?.message ||
        "Gagal menghapus coin."
      );
    }
  }

  async function toggleActive(
    coin
  ) {
    if (!canUpdate) {
      setError(
        "Anda tidak memiliki permission untuk mengubah coin."
      );
      return;
    }

    try {
      await setCoinActive(
        coin.id,
        !coin.active,
        user
      );

      await loadCoins();
    } catch (err) {
      setError(
        err?.message ||
        "Gagal mengubah status coin."
      );
    }
  }

  async function togglePaused(
    coin
  ) {
    if (!canUpdate) {
      setError(
        "Anda tidak memiliki permission untuk pause coin."
      );
      return;
    }

    try {
      await setCoinPaused(
        coin.id,
        !coin.paused,
        user
      );

      await loadCoins();
    } catch (err) {
      setError(
        err?.message ||
        "Gagal mengubah pause coin."
      );
    }
  }

  if (!canRead) {
    return (
      <section className="dashboard-panel">
        <h2>Coin</h2>
        <p>
          Anda tidak memiliki permission
          untuk melihat Coin.
        </p>
      </section>
    );
  }

  return (
    <section className="coin-crud">
      <div className="dashboard-panel">
        <div className="coin-header">
          <div>
            <span className="eyebrow">
              MASTER DATA
            </span>

            <h2>
              {editingId
                ? "Edit Coin"
                : "Create Coin"}
            </h2>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="secondary-button"
            >
              Cancel
            </button>
          )}
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

        {(editingId
          ? canUpdate
          : canCreate) && (
          <form
            className="coin-form"
            onSubmit={handleSubmit}
          >
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="USDt"
                required
              />
            </label>

            <label>
              Symbol
              <input
                name="symbol"
                value={form.symbol}
                onChange={handleChange}
                placeholder="USDT"
                required
              />
            </label>

            <label>
              Network
              <select
                name="networkId"
                value={form.networkId}
                onChange={handleChange}
              >
                <option value="ethereum">
                  Ethereum
                </option>

                <option value="bsc">
                  BNB Smart Chain
                </option>

                <option value="polygon">
                  Polygon
                </option>

                <option value="arbitrum">
                  Arbitrum
                </option>

                <option value="base">
                  Base
                </option>

                <option value="custom">
                  Custom RPC
                </option>
              </select>
            </label>

            <label>
              Type
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="token">
                  Token
                </option>

                <option value="native">
                  Native
                </option>
              </select>
            </label>

            <label>
              Decimals
              <input
                name="decimals"
                type="number"
                min="0"
                max="36"
                value={form.decimals}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Contract Address
              <input
                name="contractAddress"
                value={
                  form.contractAddress
                }
                onChange={handleChange}
                placeholder="0x..."
              />
            </label>

            <label className="checkbox-row">
              <input
                name="active"
                type="checkbox"
                checked={form.active}
                onChange={handleChange}
              />
              Active
            </label>

            <label className="checkbox-row">
              <input
                name="paused"
                type="checkbox"
                checked={form.paused}
                onChange={handleChange}
              />
              Paused
            </label>

            <button
              type="submit"
              className="primary-button"
            >
              {editingId
                ? "Update Coin"
                : "Create Coin"}
            </button>
          </form>
        )}
      </div>

      <div className="dashboard-panel">
        <div className="coin-header">
          <div>
            <span className="eyebrow">
              COIN MASTER
            </span>

            <h2>
              Coin List
            </h2>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={loadCoins}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="info-box">
            Loading coin...
          </div>
        ) : coins.length === 0 ? (
          <div className="info-box">
            Belum ada coin.
          </div>
        ) : (
          <div className="coin-table-wrapper">
            <table className="coin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Network</th>
                  <th>Decimals</th>
                  <th>Status</th>
                  <th>Pause</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {coins.map(
                  (coin) => (
                    <tr key={coin.id}>
                      <td>
                        {coin.name}
                      </td>

                      <td>
                        <strong>
                          {coin.symbol}
                        </strong>
                      </td>

                      <td>
                        {coin.networkId}
                      </td>

                      <td>
                        {coin.decimals}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="status-button"
                          onClick={() =>
                            toggleActive(
                              coin
                            )
                          }
                          disabled={!canUpdate}
                        >
                          {coin.active
                            ? "Active"
                            : "Inactive"}
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="status-button"
                          onClick={() =>
                            togglePaused(
                              coin
                            )
                          }
                          disabled={!canUpdate}
                        >
                          {coin.paused
                            ? "Paused"
                            : "Running"}
                        </button>
                      </td>

                      <td>
                        <div className="action-row">
                          {canUpdate && (
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() =>
                                editCoin(
                                  coin
                                )
                              }
                            >
                              Edit
                            </button>
                          )}

                          {canDelete && (
                            <button
                              type="button"
                              className="danger-button"
                              onClick={() =>
                                handleDelete(
                                  coin
                                )
                              }
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
