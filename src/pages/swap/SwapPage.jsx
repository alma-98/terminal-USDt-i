import React, { useMemo, useState } from 'react';
import {
  SWAP_DEX,
  validateAllocationForSwap,
  buildSwapDraft,
} from '../../modules/swap/index.js';

export default function SwapPage({
  allocations = [],
  swapPairs = [],
  walletAddress = '',
  onSwapCreated,
}) {
  const [networkId, setNetworkId] = useState('');
  const [pairId, setPairId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [draft, setDraft] = useState(null);

  const availablePairs = useMemo(
    () =>
      swapPairs.filter(
        (pair) =>
          pair?.status === 'active' &&
          (!networkId || pair.networkId === networkId)
      ),
    [swapPairs, networkId]
  );

  const activeAllocations = useMemo(
    () =>
      allocations.filter(
        (allocation) =>
          validateAllocationForSwap(allocation).allowed
      ),
    [allocations]
  );

  function selectedPair() {
    return availablePairs.find((item) => item.id === pairId) || null;
  }

  function selectedAllocation() {
    /*
     * Allocation aktif saja yang ditawarkan ke proses Swap.
     * Expired dan Revoked tidak boleh dipakai.
     */
    return activeAllocations[0] || null;
  }

  function handleGetQuote() {
    setError('');

    try {
      const pair = selectedPair();
      const allocation = selectedAllocation();

      if (!pair) {
        throw new Error('Pair/Pool PancakeSwap yang ACTIVE belum tersedia.');
      }

      if (!allocation) {
        throw new Error(
          'Tidak ada Allocation ACTIVE. Allocation EXPIRED atau REVOKED tidak dapat digunakan.'
        );
      }

      const result = buildSwapDraft({
        networkId,
        pair,
        amount,
        walletAddress,
        allocation,
      });

      setDraft(result);
    } catch (err) {
      setDraft(null);
      setError(err.message);
    }
  }

  function handleConfirm() {
    if (!draft) return;

    if (typeof onSwapCreated === 'function') {
      onSwapCreated(draft);
    }
  }

  return (
    <section>
      <h1>Swap</h1>

      <div>
        <label>
          Network
          <select
            value={networkId}
            onChange={(e) => {
              setNetworkId(e.target.value);
              setPairId('');
            }}
          >
            <option value="">Pilih Network</option>
            <option value="ethereum-mainnet">Ethereum Mainnet</option>
            <option value="ethereum-sepolia">Ethereum Sepolia</option>
            <option value="polygon">Polygon</option>
            <option value="polygon-amoy">Polygon Amoy</option>
            <option value="arbitrum">Arbitrum</option>
            <option value="arbitrum-sepolia">Arbitrum Sepolia</option>
            <option value="base">Base</option>
            <option value="base-sepolia">Base Sepolia</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          DEX
          <input value={SWAP_DEX} readOnly />
        </label>
      </div>

      <div>
        <label>
          Pair
          <select
            value={pairId}
            onChange={(e) => setPairId(e.target.value)}
          >
            <option value="">Pilih Pair</option>
            {availablePairs.map((pair) => (
              <option key={pair.id} value={pair.id}>
                {pair.baseCoin || pair.baseSymbol} /{' '}
                {pair.quoteCoin || pair.quoteSymbol}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Amount
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
      </div>

      <div>
        <strong>Wallet</strong>
        <div>{walletAddress || 'Wallet belum terhubung'}</div>
      </div>

      <div>
        <strong>Allocation</strong>
        {allocations.length === 0 ? (
          <div>Tidak ada allocation.</div>
        ) : (
          allocations.map((allocation) => {
            const status =
              allocation.expiryStatus || allocation.status || 'unknown';

            return (
              <div key={allocation.id}>
                {allocation.coinId || 'Coin'} — {status.toUpperCase()}
              </div>
            );
          })
        )}
      </div>

      {error && (
        <div role="alert">
          {error}
        </div>
      )}

      <button type="button" onClick={handleGetQuote}>
        Get Quote
      </button>

      {draft && (
        <div>
          <h2>Review</h2>
          <div>DEX: {draft.dex}</div>
          <div>Network: {draft.networkId}</div>
          <div>Pair: {draft.pair.id}</div>
          <div>Amount: {draft.amount}</div>
          <div>Allocation: ACTIVE</div>

          <div>
            Quote: menunggu quote real dari PancakeSwap
          </div>
          <div>
            Minimum Received: menunggu quote real
          </div>
          <div>
            Price Impact: menunggu quote real
          </div>
          <div>
            Estimated Gas: menunggu estimasi real
          </div>

          <button type="button" onClick={handleConfirm}>
            Confirm via Wallet Extension
          </button>
        </div>
      )}
    </section>
  );
}
