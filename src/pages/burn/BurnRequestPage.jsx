import React, { useState } from 'react';
import {
  createBurnRequest,
  BURN_BLOCKCHAIN_MODES,
} from '../../modules/burn/index.js';

export default function BurnRequestPage({
  role = 'Admin',
  userId = 'current-user',
  onCreated,
}) {
  const [form, setForm] = useState({
    coinId: '',
    walletAddress: '',
    amount: '',
    reason: '',
    blockchainMode: BURN_BLOCKCHAIN_MODES.APPLICATION,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    setError('');

    try {
      const request = createBurnRequest(form, {
        role,
        userId,
      });

      setResult(request);
      onCreated?.(request);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h1>Burn Request</h1>

      <p>
        Admin mengajukan permintaan burn.
        Burn tidak dilakukan langsung oleh Admin.
      </p>

      <form onSubmit={submit}>
        <label>
          Coin
          <input
            value={form.coinId}
            onChange={(e) =>
              setForm({ ...form, coinId: e.target.value })
            }
            placeholder="Coin ID"
          />
        </label>

        <label>
          Wallet
          <input
            value={form.walletAddress}
            onChange={(e) =>
              setForm({ ...form, walletAddress: e.target.value })
            }
            placeholder="0x..."
          />
        </label>

        <label>
          Amount
          <input
            type="number"
            min="0"
            step="any"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />
        </label>

        <label>
          Alasan
          <textarea
            value={form.reason}
            onChange={(e) =>
              setForm({ ...form, reason: e.target.value })
            }
          />
        </label>

        <label>
          Blockchain Mode
          <select
            value={form.blockchainMode}
            onChange={(e) =>
              setForm({ ...form, blockchainMode: e.target.value })
            }
          >
            <option value={BURN_BLOCKCHAIN_MODES.APPLICATION}>
              Application Mode
            </option>
            <option value={BURN_BLOCKCHAIN_MODES.SMART_CONTRACT}>
              Smart Contract Mode
            </option>
          </select>
        </label>

        <button type="submit">
          Ajukan Burn Request
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {result && (
        <div>
          <h2>Burn Request Berhasil</h2>
          <p>Status: <strong>{result.status}</strong></p>
          <p>Request menunggu proses Super Admin.</p>
        </div>
      )}
    </section>
  );
}
