import React, { useState } from 'react';

import {
  createRefillRecord,
  validateRefillInput,
} from '../../modules/refill';

export default function RefillPage({
  role = 'Admin',
  user = null,
}) {
  const [coinId, setCoinId] =
    useState('');

  const [amount, setAmount] =
    useState('');

  const [deployerWalletId, setDeployerWalletId] =
    useState('');

  const [blockchainMode, setBlockchainMode] =
    useState('Application Mode');

  const [message, setMessage] =
    useState('');

  const currentUser =
    user?.uid ||
    user?.email ||
    user?.name ||
    'unknown';

  const isSuperAdmin =
    role === 'Super Admin';

  async function handleRefill() {
    const validation =
      validateRefillInput({
        role,
        coinId,
        amount,
        deployerWalletId,
      });

    if (!validation.valid) {
      setMessage(
        Object.values(
          validation.errors,
        ).join(' '),
      );

      return;
    }

    try {
      const result =
        await createRefillRecord({
          role,
          coinId,
          amount,
          deployerWalletId,
          user: currentUser,
          blockchainMode,
        });

      setMessage(
        `Refill berhasil dibuat: ${result.id}`,
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!isSuperAdmin) {
    return (
      <section style={{ padding: 24 }}>
        <h1>Refill</h1>

        <p>
          Refill hanya tersedia untuk
          Super Admin.
        </p>
      </section>
    );
  }

  return (
    <section style={{ padding: 24 }}>
      <h1>Refill — Super Admin Only</h1>

      <p>
        Target: Active Deployer Wallet
      </p>

      <p>
        Lifetime: YES
      </p>

      <p>
        Tenor Transfer: NOT USED
      </p>

      <input
        placeholder="Coin ID"
        value={coinId}
        onChange={(e) =>
          setCoinId(e.target.value)
        }
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />

      <input
        placeholder="Active Deployer Wallet ID"
        value={deployerWalletId}
        onChange={(e) =>
          setDeployerWalletId(
            e.target.value,
          )
        }
      />

      <select
        value={blockchainMode}
        onChange={(e) =>
          setBlockchainMode(
            e.target.value,
          )
        }
      >
        <option value="Application Mode">
          Application Mode
        </option>

        <option value="Smart Contract Mode">
          Smart Contract Mode
        </option>
      </select>

      <button onClick={handleRefill}>
        Refill
      </button>

      {message && (
        <p style={{ marginTop: 20 }}>
          {message}
        </p>
      )}
    </section>
  );
}
