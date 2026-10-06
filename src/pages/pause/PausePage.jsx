import React, { useState } from 'react';
import {
  PAUSE_MODES,
  PAUSE_OPERATIONS,
  PAUSE_STATES,
  pauseApplication,
  unpauseApplication,
  prepareSmartContractPause,
  prepareSmartContractUnpause,
} from '../../modules/pause/index.js';

export default function PausePage({
  role = 'Admin',
  currentState = PAUSE_STATES.UNPAUSED,
  onStateChange,
}) {
  const [mode, setMode] = useState(PAUSE_MODES.APPLICATION);
  const [operation, setOperation] = useState('TRANSFER');
  const [state, setState] = useState(currentState);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function executePause(nextState) {
    setError('');

    try {
      let resultState;

      if (mode === PAUSE_MODES.APPLICATION) {
        resultState =
          nextState === PAUSE_STATES.PAUSED
            ? pauseApplication({ role, operation })
            : unpauseApplication({ role, operation });
      } else {
        resultState =
          nextState === PAUSE_STATES.PAUSED
            ? prepareSmartContractPause({ role, operation })
            : prepareSmartContractUnpause({ role, operation });
      }

      setState(resultState.state);
      setResult(resultState);
      onStateChange?.(resultState);
    } catch (err) {
      setError(err.message);
    }
  }

  if (role !== 'Super Admin') {
    return (
      <section>
        <h1>Pause</h1>
        <p>Hanya Super Admin yang dapat mengelola Pause.</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Pause</h1>

      <p>
        Current State: <strong>{state}</strong>
      </p>

      <label>
        Mode
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value={PAUSE_MODES.APPLICATION}>
            Application Mode
          </option>
          <option value={PAUSE_MODES.SMART_CONTRACT}>
            Smart Contract Mode
          </option>
        </select>
      </label>

      <br />
      <br />

      <label>
        Operation
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          {PAUSE_OPERATIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <br />
      <br />

      <button
        type="button"
        onClick={() => executePause(PAUSE_STATES.PAUSED)}
      >
        Pause
      </button>

      <button
        type="button"
        onClick={() => executePause(PAUSE_STATES.UNPAUSED)}
      >
        Unpause
      </button>

      {result && (
        <div>
          <p>Mode: {result.mode}</p>
          <p>State: {result.state}</p>
          <p>Operation: {result.operation}</p>

          {result.mode === PAUSE_MODES.APPLICATION && (
            <p>Application state berhasil diperbarui.</p>
          )}

          {result.mode === PAUSE_MODES.SMART_CONTRACT && (
            <p>
              Menunggu transaksi blockchain. TX Hash belum tersedia
              sampai transaksi benar-benar terjadi.
            </p>
          )}
        </div>
      )}

      {error && <p role="alert">{error}</p>}
    </section>
  );
}
