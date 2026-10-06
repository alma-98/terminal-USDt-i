import { useEffect, useState } from 'react';

import {
  createProvider,
  deleteProvider,
  listProviders,
  updateProvider
} from '../../modules/providers/providerService.js';

const EMPTY_FORM = {
  name: '',
  type: 'alchemy',
  network: 'ethereum',
  rpcUrl: '',
  chainId: '',
  explorerUrl: '',
  status: 'ACTIVE'
};

const NETWORK_NAMES = {
  ethereum: 'Ethereum Mainnet',
  ethereum_sepolia: 'Ethereum Sepolia',
  polygon: 'Polygon',
  polygon_amoy: 'Polygon Amoy',
  arbitrum: 'Arbitrum',
  arbitrum_sepolia: 'Arbitrum Sepolia',
  base: 'Base',
  base_sepolia: 'Base Sepolia'
};

export default function ProviderCrud() {
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadProviders() {
    setLoading(true);
    setError('');

    try {
      setProviders(await listProviders());
    } catch (err) {
      setError(err?.message || 'Gagal membaca Provider.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProviders();
  }, []);

  function setField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function reset() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function edit(provider) {
    setEditingId(provider.id);

    setForm({
      name: provider.name || '',
      type: provider.type || 'alchemy',
      network: provider.network || 'ethereum',
      rpcUrl: provider.rpcUrl || '',
      chainId: provider.chainId || '',
      explorerUrl: provider.explorerUrl || '',
      status: provider.status || 'ACTIVE'
    });

    setError('');
    setMessage('');
  }

  async function submit(event) {
    event.preventDefault();

    setSaving(true);
    setError('');
    setMessage('');

    try {
      if (editingId) {
        await updateProvider(editingId, form);
        setMessage('Provider berhasil diperbarui.');
      } else {
        await createProvider(form);
        setMessage('Provider berhasil dibuat.');
      }

      reset();
      await loadProviders();
    } catch (err) {
      if (err?.validationErrors) {
        setError(
          Object.values(err.validationErrors).join(' ')
        );
      } else {
        setError(err?.message || 'Gagal menyimpan Provider.');
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm('Hapus konfigurasi Provider ini?')) {
      return;
    }

    try {
      await deleteProvider(id);
      setMessage('Provider berhasil dihapus.');

      if (editingId === id) {
        reset();
      }

      await loadProviders();
    } catch (err) {
      setError(err?.message || 'Gagal menghapus Provider.');
    }
  }

  return (
    <section style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Provider Management</h1>
          <p style={styles.subtitle}>
            Konfigurasi provider blockchain untuk Super Admin
          </p>
        </div>

        <span style={styles.badge}>SUPER ADMIN</span>
      </div>

      <div style={styles.warning}>
        Credential Alchemy/Infura tidak disimpan di Firestore.
        Credential rahasia harus dikelola server-side.
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

      <form onSubmit={submit} style={styles.card}>
        <h2>Provider</h2>

        <div style={styles.grid}>
          <Field
            label="Name"
            value={form.name}
            onChange={(v) => setField('name', v)}
            placeholder="Ethereum Primary"
          />

          <label style={styles.field}>
            <span style={styles.label}>Provider Type</span>

            <select
              value={form.type}
              onChange={(e) => setField('type', e.target.value)}
              style={styles.input}
            >
              <option value="alchemy">Alchemy</option>
              <option value="infura">Infura</option>
              <option value="default">Default RPC</option>
              <option value="custom">Custom RPC</option>
            </select>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Network</span>

            <select
              value={form.network}
              onChange={(e) => setField('network', e.target.value)}
              style={styles.input}
            >
              {Object.entries(NETWORK_NAMES).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </select>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Status</span>

            <select
              value={form.status}
              onChange={(e) => setField('status', e.target.value)}
              style={styles.input}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>

          {form.type === 'custom' && (
            <>
              <Field
                label="RPC URL"
                value={form.rpcUrl}
                onChange={(v) => setField('rpcUrl', v)}
                placeholder="https://..."
                wide
              />

              <Field
                label="Chain ID"
                value={form.chainId}
                onChange={(v) => setField('chainId', v)}
                placeholder="1"
              />

              <Field
                label="Explorer URL"
                value={form.explorerUrl}
                onChange={(v) => setField('explorerUrl', v)}
                placeholder="https://etherscan.io"
              />
            </>
          )}
        </div>

        <div style={styles.serverNotice}>
          {form.type === 'alchemy' && (
            <>
              Alchemy API Key: <strong>server-side environment</strong>
            </>
          )}

          {form.type === 'infura' && (
            <>
              Infura Project ID + API Secret:{' '}
              <strong>server-side environment</strong>
            </>
          )}

          {form.type === 'default' && (
            <>
              Default RPC: <strong>built-in configuration</strong>
            </>
          )}

          {form.type === 'custom' && (
            <>
              Custom RPC URL: <strong>configuration field</strong>
            </>
          )}
        </div>

        <div style={styles.actions}>
          <button
            type="submit"
            disabled={saving}
            style={styles.primary}
          >
            {saving
              ? 'Menyimpan...'
              : editingId
                ? 'Simpan Perubahan'
                : 'Create Provider'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={reset}
              style={styles.secondary}
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div style={styles.card}>
        <div style={styles.listHeader}>
          <h2>Provider Terdaftar</h2>

          <button
            type="button"
            onClick={loadProviders}
            style={styles.secondary}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Memuat...</p>
        ) : providers.length === 0 ? (
          <p>Belum ada Provider.</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Provider</th>
                  <th style={styles.th}>Network</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {providers.map((provider) => (
                  <tr key={provider.id}>
                    <td style={styles.td}>
                      {provider.name || '-'}
                    </td>

                    <td style={styles.td}>
                      {String(provider.type || '').toUpperCase()}
                    </td>

                    <td style={styles.td}>
                      {NETWORK_NAMES[provider.network] ||
                        provider.network ||
                        '-'}
                    </td>

                    <td style={styles.td}>
                      {provider.status || '-'}
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          type="button"
                          onClick={() => edit(provider)}
                          style={styles.secondary}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => remove(provider.id)}
                          style={styles.danger}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  wide
}) {
  return (
    <label
      style={{
        ...styles.field,
        ...(wide ? styles.wide : {})
      }}
    >
      <span style={styles.label}>{label}</span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
        autoComplete="off"
      />
    </label>
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
    padding: '7px 10px',
    borderRadius: 8,
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

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 16
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7
  },

  wide: {
    gridColumn: '1 / -1'
  },

  label: {
    fontWeight: 600,
    fontSize: 14
  },

  input: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: 8,
    background: '#fff'
  },

  actions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginTop: 18
  },

  primary: {
    border: 0,
    borderRadius: 8,
    padding: '10px 15px',
    fontWeight: 700,
    cursor: 'pointer'
  },

  secondary: {
    border: '1px solid #ccc',
    borderRadius: 8,
    padding: '9px 13px',
    background: '#fff',
    cursor: 'pointer'
  },

  danger: {
    border: '1px solid #c33',
    color: '#a00',
    borderRadius: 8,
    padding: '9px 13px',
    background: '#fff',
    cursor: 'pointer'
  },

  warning: {
    border: '1px solid #d6b400',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },

  serverNotice: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: 13
  },

  error: {
    border: '1px solid #c33',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },

  success: {
    border: '1px solid #39843c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },

  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    borderBottom: '2px solid #ddd'
  },

  td: {
    padding: 10,
    borderBottom: '1px solid #eee'
  }
};
