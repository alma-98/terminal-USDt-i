import { useEffect, useState } from 'react';

import {
  DEFAULT_NETWORK_ID,
  getSupportedNetworks,
  listNetworks
} from '../../modules/networks/index.js';

export default function NetworkCrud() {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadNetworks() {
    setLoading(true);
    setError('');

    try {
      const result = await listNetworks();

      setNetworks(result);
    } catch (err) {
      setError(
        err?.message || 'Gagal membaca Network.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNetworks();
  }, []);

  return (
    <section style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Network Management
          </h1>

          <p style={styles.subtitle}>
            Network blockchain yang digunakan oleh
            Coin, Provider, Wallet, dan Transaction.
          </p>
        </div>

        <span style={styles.badge}>
          SUPER ADMIN
        </span>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <div style={styles.card}>
        <h2>Network Compatibility</h2>

        <div style={styles.rule}>
          <strong>
            Coin Network
          </strong>

          <span>=</span>

          <strong>
            Provider Network
          </strong>

          <span>=</span>

          <strong>
            Wallet Network
          </strong>

          <span>=</span>

          <strong>
            Transaction Network
          </strong>
        </div>

        <p style={styles.note}>
          Transaction tidak boleh diproses jika
          Network tidak cocok.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.listHeader}>
          <h2>Supported Networks</h2>

          <button
            type="button"
            onClick={loadNetworks}
            style={styles.button}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Memuat Network...</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Network ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Chain ID</th>
                  <th style={styles.th}>Native</th>
                  <th style={styles.th}>Explorer</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {networks.map((network) => (
                  <tr key={network.id}>
                    <td style={styles.td}>
                      {network.id}
                    </td>

                    <td style={styles.td}>
                      <strong>
                        {network.name}
                      </strong>

                      {network.id ===
                        DEFAULT_NETWORK_ID && (
                        <span
                          style={styles.defaultBadge}
                        >
                          DEFAULT
                        </span>
                      )}
                    </td>

                    <td style={styles.td}>
                      {network.chainId}
                    </td>

                    <td style={styles.td}>
                      {network.nativeCurrency}
                    </td>

                    <td style={styles.td}>
                      {network.explorerUrl}
                    </td>

                    <td style={styles.td}>
                      {network.active
                        ? 'ACTIVE'
                        : 'INACTIVE'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h2>Network Registry</h2>

        <p>
          Total network:
          {' '}
          <strong>
            {getSupportedNetworks().length}
          </strong>
        </p>

        <p style={styles.note}>
          Ethereum Mainnet adalah default network
          dengan Chain ID 1.
        </p>
      </div>
    </section>
  );
}

const styles = {
  page: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: 24
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20
  },

  title: {
    margin: 0
  },

  subtitle: {
    opacity: 0.7
  },

  badge: {
    border: '1px solid currentColor',
    borderRadius: 8,
    padding: '7px 10px',
    fontSize: 12,
    fontWeight: 700
  },

  card: {
    border: '1px solid #ddd',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    background: '#fff'
  },

  rule: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    border: '1px solid #ddd',
    borderRadius: 8
  },

  note: {
    opacity: 0.7
  },

  listHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  button: {
    padding: '9px 13px',
    border: '1px solid #ccc',
    borderRadius: 8,
    background: '#fff',
    cursor: 'pointer'
  },

  tableWrap: {
    overflowX: 'auto'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  th: {
    textAlign: 'left',
    padding: 10,
    borderBottom: '2px solid #ddd',
    whiteSpace: 'nowrap'
  },

  td: {
    padding: 10,
    borderBottom: '1px solid #eee',
    verticalAlign: 'top'
  },

  defaultBadge: {
    display: 'inline-block',
    marginLeft: 8,
    padding: '3px 6px',
    border: '1px solid currentColor',
    borderRadius: 5,
    fontSize: 10,
    fontWeight: 700
  },

  error: {
    border: '1px solid #c33',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  }
};
