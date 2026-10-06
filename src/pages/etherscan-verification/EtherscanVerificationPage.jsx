import React, { useState } from 'react';

import {
  createExplorerReference,
  retryVerification,
  validateNetworkConsistency,
} from '../../modules/etherscanVerification';

export default function EtherscanVerificationPage({
  providerVerifier = null,
}) {
  const [txHash, setTxHash] = useState('');
  const [networkId, setNetworkId] =
    useState('ethereum');

  const [coinNetwork, setCoinNetwork] =
    useState('ethereum');

  const [providerNetwork, setProviderNetwork] =
    useState('ethereum');

  const [walletNetwork, setWalletNetwork] =
    useState('ethereum');

  const [transactionNetwork, setTransactionNetwork] =
    useState('ethereum');

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  function checkCompatibility() {
    const result =
      validateNetworkConsistency({
        coinNetwork,
        providerNetwork,
        walletNetwork,
        transactionNetwork,
      });

    setMessage(result.reason);

    return result.valid;
  }

  function createReference() {
    try {
      if (!checkCompatibility()) {
        return;
      }

      const reference =
        createExplorerReference({
          txHash,
          networkId,
        });

      setResult({
        status: 'REFERENCE_READY',
        explorerReference: reference,
      });
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function verify() {
    try {
      if (!checkCompatibility()) {
        return;
      }

      const verification =
        await retryVerification({
          txHash,
          networkId,
          providerVerifier,
        });

      setResult(verification);
      setMessage(
        verification.message || 'Verification selesai.',
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section style={{ padding: 24 }}>
      <h1>Etherscan Transaction Verification</h1>

      <h2>Transaction</h2>

      <input
        placeholder="TX Hash"
        value={txHash}
        onChange={(e) =>
          setTxHash(e.target.value)
        }
      />

      <select
        value={networkId}
        onChange={(e) =>
          setNetworkId(e.target.value)
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

      <h2>Network Compatibility</h2>

      <select
        value={coinNetwork}
        onChange={(e) =>
          setCoinNetwork(e.target.value)
        }
      >
        <option value="ethereum">Coin: Ethereum</option>
        <option value="sepolia">Coin: Sepolia</option>
        <option value="polygon">Coin: Polygon</option>
        <option value="polygonAmoy">
          Coin: Polygon Amoy
        </option>
        <option value="arbitrum">
          Coin: Arbitrum
        </option>
        <option value="arbitrumSepolia">
          Coin: Arbitrum Sepolia
        </option>
        <option value="base">Coin: Base</option>
        <option value="baseSepolia">
          Coin: Base Sepolia
        </option>
      </select>

      <select
        value={providerNetwork}
        onChange={(e) =>
          setProviderNetwork(e.target.value)
        }
      >
        <option value="ethereum">
          Provider: Ethereum
        </option>
        <option value="sepolia">
          Provider: Sepolia
        </option>
        <option value="polygon">
          Provider: Polygon
        </option>
        <option value="polygonAmoy">
          Provider: Polygon Amoy
        </option>
        <option value="arbitrum">
          Provider: Arbitrum
        </option>
        <option value="arbitrumSepolia">
          Provider: Arbitrum Sepolia
        </option>
        <option value="base">
          Provider: Base
        </option>
        <option value="baseSepolia">
          Provider: Base Sepolia
        </option>
      </select>

      <select
        value={walletNetwork}
        onChange={(e) =>
          setWalletNetwork(e.target.value)
        }
      >
        <option value="ethereum">
          Wallet: Ethereum
        </option>
        <option value="sepolia">
          Wallet: Sepolia
        </option>
        <option value="polygon">
          Wallet: Polygon
        </option>
        <option value="polygonAmoy">
          Wallet: Polygon Amoy
        </option>
        <option value="arbitrum">
          Wallet: Arbitrum
        </option>
        <option value="arbitrumSepolia">
          Wallet: Arbitrum Sepolia
        </option>
        <option value="base">
          Wallet: Base
        </option>
        <option value="baseSepolia">
          Wallet: Base Sepolia
        </option>
      </select>

      <select
        value={transactionNetwork}
        onChange={(e) =>
          setTransactionNetwork(e.target.value)
        }
      >
        <option value="ethereum">
          Transaction: Ethereum
        </option>
        <option value="sepolia">
          Transaction: Sepolia
        </option>
        <option value="polygon">
          Transaction: Polygon
        </option>
        <option value="polygonAmoy">
          Transaction: Polygon Amoy
        </option>
        <option value="arbitrum">
          Transaction: Arbitrum
        </option>
        <option value="arbitrumSepolia">
          Transaction: Arbitrum Sepolia
        </option>
        <option value="base">
          Transaction: Base
        </option>
        <option value="baseSepolia">
          Transaction: Base Sepolia
        </option>
      </select>

      <div style={{ marginTop: 20 }}>
        <button onClick={checkCompatibility}>
          Check Network Compatibility
        </button>

        <button
          onClick={createReference}
          style={{ marginLeft: 8 }}
        >
          Explorer Reference
        </button>

        <button
          onClick={verify}
          style={{ marginLeft: 8 }}
        >
          Verify Transaction
        </button>
      </div>

      {message && (
        <p style={{ marginTop: 20 }}>
          {message}
        </p>
      )}

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
