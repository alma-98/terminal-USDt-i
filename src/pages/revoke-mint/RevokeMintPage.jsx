import React, { useState } from 'react';

import {
  MINT_STATES,
  REVOKE_MINT_MODES,
  revokeMint,
} from '../../modules/revokeMint/index.js';

export default function RevokeMintPage({
  role = 'Admin',
}) {
  const [coinId, setCoinId] = useState('');
  const [mode, setMode] = useState(
    REVOKE_MINT_MODES.APPLICATION
  );
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function handleRevoke() {
    setError('');
    setResult(null);

    try {
      const response = revokeMint({
        role,
        coinId,
        mode,
      });

      setResult(response);
    } catch (err) {
      setError(err.message);
    }
  }

  if (role !== 'Super Admin') {
    return (
      <section>
        <h1>Revoke Mint</h1>
        <p>
          Hanya Super Admin yang dapat melakukan Revoke Mint.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1>Revoke Mint</h1>

      <label>
        Coin
        <input
          value={coinId}
          onChange={(e) => setCoinId(e.target.value)}
          placeholder="Coin ID"
        />
      </label>

      <br />
      <br />

      <label>
        Mode
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value={REVOKE_MINT_MODES.APPLICATION}>
            Application Mode
          </option>

          <option value={REVOKE_MINT_MODES.SMART_CONTRACT}>
            Smart Contract Mode
          </option>
        </select>
      </label>

      <br />
      <br />

      <button
        type="button"
        onClick={handleRevoke}
      >
        Revoke Mint
      </button>

      {result && (
        <div>
          <hr />

          <p>
            Coin: <strong>{result.coinId}</strong>
          </p>

          <p>
            Mode: <strong>{result.mode}</strong>
          </p>

          <p>
            Mint Status:{' '}
            <strong>{result.mintStatus}</strong>
          </p>

          <p>
            Blockchain Status:{' '}
            <strong>{result.blockchainStatus}</strong>
          </p>

          {result.mintStatus === MINT_STATES.REVOKED && (
            <p>
              Mint berhasil berstatus REVOKED pada mode yang
              dipilih.
            </p>
          )}

          {result.mode ===
            REVOKE_MINT_MODES.SMART_CONTRACT && (
            <p>
              TX Hash belum tersedia sampai transaksi
              blockchain benar-benar dilakukan.
            </p>
          )}
        </div>
      )}

      {error && (
        <p role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
