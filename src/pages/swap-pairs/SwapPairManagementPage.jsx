import React, { useState } from 'react';

import {
  SWAP_PAIR_STATUS,
  SWAP_PAIR_DEX,
  createSwapPair,
  updateSwapPair,
  setSwapPairStatus,
  deleteSwapPair,
} from '../../modules/swapPair/index.js';

const INITIAL_FORM = {
  baseCoin: '',
  quoteCoin: '',
  networkId: '',
  dex: SWAP_PAIR_DEX.PANCAKESWAP,
  pairAddress: '',
  routerAddress: '',
  status: SWAP_PAIR_STATUS.ACTIVE,
};

export default function SwapPairManagementPage({
  user,
  pairs = [],
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const isSuperAdmin =
    String(user?.role || '').toUpperCase() ===
    'SUPER_ADMIN';

  if (!isSuperAdmin) {
    return (
      <section>
        <h1>Swap Pair Management</h1>
        <p>
          Akses hanya tersedia untuk Super Admin.
        </p>
      </section>
    );
  }

  function change(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function reset() {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      let result;

      if (editingId) {
        const existing = pairs.find(
          (pair) => pair.id === editingId
        );

        if (!existing) {
          throw new Error(
            'Swap Pair yang diedit tidak ditemukan.'
          );
        }

        result = updateSwapPair(
          existing,
          form,
          user
        );
      } else {
        result = createSwapPair(
          form,
          user
        );
      }

      if (typeof onSave === 'function') {
        onSave({
          ...result,
          id:
            editingId ||
            crypto.randomUUID(),
        });
      }

      reset();
    } catch (err) {
      setError(err.message);
    }
  }

  function edit(pair) {
    setEditingId(pair.id);

    setForm({
      baseCoin: pair.baseCoin || '',
      quoteCoin: pair.quoteCoin || '',
      networkId: pair.networkId || '',
      dex: pair.dex || SWAP_PAIR_DEX.PANCAKESWAP,
      pairAddress: pair.pairAddress || '',
      routerAddress: pair.routerAddress || '',
      status:
        pair.status ||
        SWAP_PAIR_STATUS.ACTIVE,
    });

    setError('');
  }

  function toggleStatus(pair) {
    const nextStatus =
      pair.status === SWAP_PAIR_STATUS.ACTIVE
        ? SWAP_PAIR_STATUS.INACTIVE
        : SWAP_PAIR_STATUS.ACTIVE;

    const updated = setSwapPairStatus(
      pair,
      nextStatus,
      user
    );

    if (typeof onSave === 'function') {
      onSave(updated);
    }
  }

  function remove(pair) {
    if (
      !window.confirm(
        'Nonaktifkan Swap Pair ini?'
      )
    ) {
      return;
    }

    const updated = deleteSwapPair(
      pair,
      user
    );

    if (typeof onDelete === 'function') {
      onDelete(updated);
    }
  }

  return (
    <section>
      <h1>Swap Pair Management</h1>

      <p>
        Kelola pasangan Coin/Token yang tersedia
        untuk Swap.
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          Base Coin
          <input
            value={form.baseCoin}
            onChange={(e) =>
              change(
                'baseCoin',
                e.target.value
              )
            }
            placeholder="USDt"
            required
          />
        </label>

        <label>
          Quote Coin
          <input
            value={form.quoteCoin}
            onChange={(e) =>
              change(
                'quoteCoin',
                e.target.value
              )
            }
            placeholder="USDC"
            required
          />
        </label>

        <label>
          Network
          <select
            value={form.networkId}
            onChange={(e) =>
              change(
                'networkId',
                e.target.value
              )
            }
            required
          >
            <option value="">
              Pilih Network
            </option>
            <option value="1">
              Ethereum Mainnet
            </option>
            <option value="11155111">
              Ethereum Sepolia
            </option>
            <option value="137">
              Polygon
            </option>
            <option value="80002">
              Polygon Amoy
            </option>
            <option value="42161">
              Arbitrum
            </option>
            <option value="421614">
              Arbitrum Sepolia
            </option>
            <option value="8453">
              Base
            </option>
            <option value="84532">
              Base Sepolia
            </option>
          </select>
        </label>

        <label>
          DEX
          <select
            value={form.dex}
            onChange={(e) =>
              change(
                'dex',
                e.target.value
              )
            }
          >
            <option value="PancakeSwap">
              PancakeSwap
            </option>
          </select>
        </label>

        <label>
          Pair / Pool Address
          <input
            value={form.pairAddress}
            onChange={(e) =>
              change(
                'pairAddress',
                e.target.value
              )
            }
            placeholder="0x..."
            required
          />
        </label>

        <label>
          Router
          <input
            value={form.routerAddress}
            onChange={(e) =>
              change(
                'routerAddress',
                e.target.value
              )
            }
            placeholder="0x..."
            required
          />
        </label>

        <label>
          Status
          <select
            value={form.status}
            onChange={(e) =>
              change(
                'status',
                e.target.value
              )
            }
          >
            <option value="active">
              ACTIVE
            </option>
            <option value="inactive">
              INACTIVE
            </option>
          </select>
        </label>

        {error && (
          <div role="alert">
            {error}
          </div>
        )}

        <button type="submit">
          {editingId
            ? 'Update Pair'
            : 'Create Pair'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={reset}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h2>Swap Pairs</h2>

      {pairs.length === 0 && (
        <p>
          Belum ada Swap Pair.
        </p>
      )}

      {pairs.map((pair) => (
        <article key={pair.id}>
          <h3>
            {pair.baseCoin} / {pair.quoteCoin}
          </h3>

          <div>
            Network: {pair.networkId}
          </div>

          <div>
            DEX: {pair.dex}
          </div>

          <div>
            Pair/Pool: {pair.pairAddress}
          </div>

          <div>
            Router: {pair.routerAddress}
          </div>

          <div>
            Status:{' '}
            {String(
              pair.status
            ).toUpperCase()}
          </div>

          <button
            type="button"
            onClick={() => edit(pair)}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              toggleStatus(pair)
            }
          >
            {pair.status ===
            SWAP_PAIR_STATUS.ACTIVE
              ? 'Set Inactive'
              : 'Set Active'}
          </button>

          <button
            type="button"
            onClick={() => remove(pair)}
          >
            Delete
          </button>
        </article>
      ))}
    </section>
  );
}
