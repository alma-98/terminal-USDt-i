import React, { useState } from 'react';

import {
  addControllerTxHash,
  createControllerTx,
  deleteControllerTxHash,
  deleteControllerTxRecord,
  editControllerTxHash,
  listControllerTxHashes,
} from '../../modules/controllerTx/controllerTxService';

import {
  getWalletAccounts,
  sendOnChainTransaction,
} from '../../modules/controllerTx/onChainController';

import {
  createExplorerReference,
  verifyTransaction,
} from '../../modules/etherscanVerification';

export default function ControllerTxPage({
  user = null,
}) {
  const currentUser =
    user?.uid ||
    user?.email ||
    user?.name ||
    'unknown';

  const [controllerTxId, setControllerTxId] =
    useState('');

  const [name, setName] =
    useState('');

  const [network, setNetwork] =
    useState('ethereum');

  const [to, setTo] =
    useState('');

  const [value, setValue] =
    useState('0x0');

  const [txHash, setTxHash] =
    useState('');

  const [hashRecordId, setHashRecordId] =
    useState('');

  const [newHash, setNewHash] =
    useState('');

  const [reason, setReason] =
    useState('');

  const [hashes, setHashes] =
    useState([]);

  const [result, setResult] =
    useState(null);

  const [message, setMessage] =
    useState('');

  async function handleCreateController() {
    try {
      const result =
        await createControllerTx({
          name,
          network,
          user: currentUser,
        });

      setControllerTxId(result.id);

      setMessage(
        `Controller TX dibuat: ${result.id}`,
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleRealOnChain() {
    try {
      if (!controllerTxId) {
        throw new Error(
          'Buat Controller TX terlebih dahulu.',
        );
      }

      const accounts =
        await getWalletAccounts();

      const from = accounts[0];

      const realHash =
        await sendOnChainTransaction({
          from,
          to,
          value,
        });

      setTxHash(realHash);

      await addControllerTxHash({
        controllerTxId,
        txHash: realHash,
        network,
        user: currentUser,
      });

      setMessage(
        `REAL ON-CHAIN TX HASH: ${realHash}`,
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleAddHash() {
    try {
      const result =
        await addControllerTxHash({
          controllerTxId,
          txHash,
          network,
          user: currentUser,
        });

      setMessage(
        `Hash berhasil ditambahkan: ${result.txHash}`,
      );

      await handleLoadHashes();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleLoadHashes() {
    try {
      const records =
        await listControllerTxHashes(
          controllerTxId,
        );

      setHashes(records);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleEditHash() {
    try {
      const result =
        await editControllerTxHash({
          hashRecordId,
          newTxHash: newHash,
          reason,
          user: currentUser,
        });

      setMessage(
        `Hash diedit: ${result.old} → ${result.new}`,
      );

      await handleLoadHashes();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDeleteHash() {
    try {
      await deleteControllerTxHash(
        hashRecordId,
      );

      setMessage(
        'Hash record berhasil dihapus dari Control Center.',
      );

      await handleLoadHashes();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDeleteController() {
    try {
      await deleteControllerTxRecord(
        controllerTxId,
      );

      setMessage(
        'Controller TX record berhasil dihapus dari Control Center.',
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleVerify() {
    try {
      const verification =
        await verifyTransaction({
          txHash,
          networkId: network,
        });

      const reference =
        createExplorerReference({
          txHash,
          networkId: network,
        });

      setResult({
        ...verification,
        explorerReference: reference,
      });

      setMessage(
        'Verification reference berhasil dibuat.',
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section style={{ padding: 24 }}>
      <h1>
        Etherscan Transaction Verification
      </h1>

      <h2>Controller TX</h2>

      <input
        placeholder="Controller TX Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <select
        value={network}
        onChange={(e) =>
          setNetwork(e.target.value)
        }
      >
        <option value="ethereum">
          Ethereum Mainnet
        </option>

        <option value="sepolia">
          Ethereum Sepolia
        </option>

        <option value="polygon">
          Polygon
        </option>

        <option value="polygonAmoy">
          Polygon Amoy
        </option>

        <option value="arbitrum">
          Arbitrum
        </option>

        <option value="arbitrumSepolia">
          Arbitrum Sepolia
        </option>

        <option value="base">
          Base
        </option>

        <option value="baseSepolia">
          Base Sepolia
        </option>
      </select>

      <button
        onClick={handleCreateController}
      >
        Create Controller TX
      </button>

      {controllerTxId && (
        <p>
          Controller TX ID: {controllerTxId}
        </p>
      )}

      <hr />

      <h2>Real On-Chain Transaction</h2>

      <input
        placeholder="Destination Address"
        value={to}
        onChange={(e) =>
          setTo(e.target.value)
        }
      />

      <input
        placeholder="Value (hex)"
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
      />

      <button onClick={handleRealOnChain}>
        Controller TX — Send On-Chain
      </button>

      <hr />

      <h2>Controller TX Hash</h2>

      <input
        placeholder="TX Hash"
        value={txHash}
        onChange={(e) =>
          setTxHash(e.target.value)
        }
      />

      <button onClick={handleAddHash}>
        Add Hash
      </button>

      <button onClick={handleLoadHashes}>
        Load Hashes
      </button>

      <p>
        Hash dapat dibuat 1×1 atau 1×N sesuai
        kebutuhan Controller TX.
      </p>

      {hashes.map((item) => (
        <div
          key={item.id}
          style={{
            marginTop: 8,
            padding: 8,
            border: '1px solid #ccc',
          }}
        >
          <div>
            {item.txHash}
          </div>

          <div>
            {item.network}
          </div>
        </div>
      ))}

      <hr />

      <h2>Edit Hash</h2>

      <input
        placeholder="Hash Record ID"
        value={hashRecordId}
        onChange={(e) =>
          setHashRecordId(e.target.value)
        }
      />

      <input
        placeholder="New TX Hash"
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

      <button onClick={handleEditHash}>
        Edit Hash
      </button>

      <button onClick={handleDeleteHash}>
        Delete Hash Record
      </button>

      <hr />

      <h2>Transaction Verification</h2>

      <button onClick={handleVerify}>
        Verify TX
      </button>

      <button
        onClick={() =>
          window.open(
            result?.explorerReference?.explorerUrl,
            '_blank',
            'noopener,noreferrer',
          )
        }
        disabled={
          !result?.explorerReference?.explorerUrl
        }
      >
        Open Explorer
      </button>

      <hr />

      <h2>Controller TX Record</h2>

      <button
        onClick={handleDeleteController}
      >
        Delete Controller TX Record
      </button>

      {message && (
        <p style={{ marginTop: 20 }}>
          {message}
        </p>
      )}

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(
            result,
            null,
            2,
          )}
        </pre>
      )}
    </section>
  );
}
