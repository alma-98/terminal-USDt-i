import React, { useState } from 'react';

import {
  createHashRecord,
  editHashRecord,
  validateHashEdit,
  validateHashRecord,
} from '../../modules/transactionHash';

export default function TransactionHashPage({
  user = null,
}) {
  const currentUser =
    user?.uid ||
    user?.email ||
    user?.name ||
    'unknown';

  const [transactionId, setTransactionId] = useState('');
  const [hashNumber, setHashNumber] = useState('1');
  const [hash, setHash] = useState('');

  const [hashRecordId, setHashRecordId] = useState('');
  const [newHash, setNewHash] = useState('');
  const [reason, setReason] = useState('');

  const [message, setMessage] = useState('');

  async function handleCreate() {
    const validation = validateHashRecord({
      transactionId,
      hashNumber,
      hash,
    });

    if (!validation.valid) {
      setMessage(
        Object.values(validation.errors).join(' '),
      );
      return;
    }

    try {
      const result = await createHashRecord({
        transactionId,
        hashNumber,
        hash,
        user: currentUser,
      });

      setMessage(
        `${result.hashId} berhasil disimpan.`,
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleEdit() {
    const validation = validateHashEdit({
      hashRecordId,
      newHash,
      reason,
      user: currentUser,
    });

    if (!validation.valid) {
      setMessage(
        Object.values(validation.errors).join(' '),
      );
      return;
    }

    try {
      const result = await editHashRecord({
        hashRecordId,
        newHash,
        reason,
        user: currentUser,
      });

      setMessage(
        `${result.hashId} berhasil diedit.`,
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section style={{ padding: 24 }}>
      <h1>Transaction Hash + Hash × Hash</h1>

      <h2>Hash Records</h2>

      <input
        placeholder="Transaction ID"
        value={transactionId}
        onChange={(e) =>
          setTransactionId(e.target.value)
        }
      />

      <input
        type="number"
        min="1"
        placeholder="Hash Number"
        value={hashNumber}
        onChange={(e) =>
          setHashNumber(e.target.value)
        }
      />

      <input
        placeholder="TX Hash"
        value={hash}
        onChange={(e) =>
          setHash(e.target.value)
        }
      />

      <button onClick={handleCreate}>
        Simpan Hash
      </button>

      <hr />

      <h2>Edit Hash Satu Per Satu</h2>

      <input
        placeholder="Hash Record ID"
        value={hashRecordId}
        onChange={(e) =>
          setHashRecordId(e.target.value)
        }
      />

      <input
        placeholder="New Hash"
        value={newHash}
        onChange={(e) =>
          setNewHash(e.target.value)
        }
      />

      <input
        placeholder="Reason"
        value={reason}
        onChange={(e) =>
          setReason(e.target.value)
        }
      />

      <button onClick={handleEdit}>
        Edit Hash
      </button>

      {message && <p>{message}</p>}
    </section>
  );
}
