import { useEffect, useState } from 'react';
import {
  createSwapPair,
  deleteSwapPair,
  listSwapPairs,
  updateSwapPair
} from '../../modules/swapPairs/swapPairService.js';

const EMPTY_FORM = {
  baseCoin: '',
  quoteCoin: '',
  network: '',
  dex: '',
  pairPoolAddress: '',
  router: '',
  status: 'ACTIVE'
};

export default function SwapPairCrud() {
  const [pairs, setPairs] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadPairs() {
    setLoading(true);
    setError('');

    try {
      const result = await listSwapPairs();
      setPairs(result);
    } catch (err) {
      setError(err?.message || 'Gagal membaca Swap Pair.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPairs();
  }, []);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function editPair(pair) {
    setEditingId(pair.id);

    setForm({
      baseCoin: pair.baseCoin || '',
      quoteCoin: pair.quoteCoin || '',
      network: pair.network || '',
      dex: pair.dex || '',
      pairPoolAddress: pair.pairPoolAddress || '',
      router: pair.router || '',
      status: pair.status || 'ACTIVE'
    });

    setMessage('');
    setError('');
  }

  async function submit(event) {
    event.preventDefault();

    setSaving(true);
    setError('');
    setMessage('');

    try {
      if (editingId) {
        await updateSwapPair(editingId, form);
        setMessage('Swap Pair berhasil diperbarui.');
      } else {
        await createSwapPair(form);
        setMessage('Swap Pair berhasil dibuat.');
      }

      resetForm();
      await loadPairs();
    } catch (err) {
      if (err?.validationErrors) {
        setError(
          Object.values(err.validationErrors).join(' ')
        );
      } else {
        setError(err?.message || 'Gagal menyimpan Swap Pair.');
      }
    } finally {
      setSaving(false);
    }
  }

  async function removePair(id) {
    const confirmed = window.confirm(
      'Hapus Swap Pair ini? Tindakan ini tidak melakukan transaksi blockchain.'
    );

    if (!confirmed) return;

    setError('');
    setMessage('');

    try {
      await deleteSwapPair(id);
      setMessage('Swap Pair berhasil dihapus.');

      if (editingId === id) {
        resetForm();
      }

      await loadPairs();
    } catch (err) {
      setError(err?.message || 'Gagal menghapus Swap Pair.');
    }
  }

  return (
    <section style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Swap Pair CRUD</h1>
          <p style={styles.subtitle}>
            Pengelolaan Pair/Pool DEX oleh Super Admin
          </p>
        </div>

        <span style={styles.badge}>SUPER ADMIN</span>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

      <form onSubmit={submit} style={styles.card}>
        <h2 style={styles.cardTitle}>
          {editingId ? 'Edit Swap Pair' : 'Tambah Swap Pair'}
        </h2>

        <div style={styles.grid}>
          <Field
            label="Base Coin"
            value={form.baseCoin}
            onChange={(value) => updateField('baseCoin', value)}
            placeholder="USDt"
          />

          <Field
            label="Quote Coin"
            value={form.quoteCoin}
            onChange={(value) => updateField('quoteCoin', value)}
            placeholder="USDC"
          />

          <Field
            label="Network"
            value={form.network}
            onChange={(value) => updateField('network', value)}
            placeholder="Ethereum Mainnet"
          />

          <Field
            label="DEX"
            value={form.dex}
            onChange={(value) => updateField('dex', value)}
            placeholder="PancakeSwap"
          />

          <Field
            label="Pair / Pool Address"
            value={form.pairPoolAddress}
            onChange={(value) => updateField('pairPoolAddress', value)}
            placeholder="0x..."
            wide
          />

          <Field
            label="Router"
            value={form.router}
            onChange={(value) => updateField('router', value)}
            placeholder="0x..."
            wide
          />

          <label style={styles.field}>
            <span style={styles.label}>Status</span>
            <select
              value={form.status}
              onChange={(event) =>
                updateField('status', event.target.value)
              }
              style={styles.input}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>
        </div>

        <div style={styles.actions}>
          <button
            type="submit"
            disabled={saving}
            style={styles.primaryButton}
          >
            {saving
              ? 'Menyimpan...'
              : editingId
                ? 'Simpan Perubahan'
                : 'Create Swap Pair'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={styles.secondaryButton}
            >
              Batal Edit
            </button>
          )}
        </div>
      </form>

      <div style={styles.card}>
        <div style={styles.tableHeader}>
          <h2 style={styles.cardTitle}>Daftar Swap Pair</h2>

          <button
            type="button"
            onClick={loadPairs}
            disabled={loading}
            style={styles.secondaryButton}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Memuat Swap Pair...</p>
        ) : pairs.length === 0 ? (
          <div style={styles.empty}>
            Belum ada Swap Pair.
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Pair</th>
                  <th style={styles.th}>Network</th>
                  <th style={styles.th}>DEX</th>
                  <th style={styles.th}>Pool</th>
                  <th style={styles.th}>Router</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {pairs.map((pair) => (
                  <tr key={pair.id}>
                    <td style={styles.td}>
                      <strong>
                        {pair.baseCoin} / {pair.quoteCoin}
                      </strong>
                    </td>

                    <td style={styles.td}>
                      {pair.network}
                    </td>

                    <td style={styles.td}>
                      {pair.dex}
                    </td>

                    <td style={styles.address}>
                      {pair.pairPoolAddress}
                    </td>

                    <td style={styles.address}>
                      {pair.router}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={
                          pair.status === 'ACTIVE'
                            ? styles.active
                            : styles.inactive
                        }
                      >
                        {pair.status}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.rowActions}>
                        <button
                          type="button"
                          onClick={() => editPair(pair)}
                          style={styles.secondaryButton}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => removePair(pair.id)}
                          style={styles.dangerButton}
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
  wide = false
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
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={styles.input}
        autoComplete="off"
      />
    </label>
  );
}

const styles = {
  page: {
    padding: 24,
    maxWidth: 1500,
    margin: '0 auto'
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24
  },

  title: {
    margin: 0,
    fontSize: 28
  },

  subtitle: {
    margin: '6px 0 0',
    opacity: 0.7
  },

  badge: {
    padding: '7px 12px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
    border: '1px solid currentColor'
  },

  card: {
    padding: 20,
    marginBottom: 20,
    border: '1px solid #d8d8d8',
    borderRadius: 12,
    background: '#fff'
  },

  cardTitle: {
    margin: '0 0 18px',
    fontSize: 20
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
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 12px',
    border: '1px solid #cfcfcf',
    borderRadius: 8,
    fontSize: 14,
    background: '#fff'
  },

  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 20
  },

  primaryButton: {
    padding: '10px 16px',
    border: 0,
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 700
  },

  secondaryButton: {
    padding: '9px 13px',
    border: '1px solid #c8c8c8',
    borderRadius: 8,
    cursor: 'pointer',
    background: '#fff'
  },

  dangerButton: {
    padding: '9px 13px',
    border: '1px solid #d33',
    color: '#b00',
    borderRadius: 8,
    cursor: 'pointer',
    background: '#fff'
  },

  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },

  tableWrapper: {
    overflowX: 'auto'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  th: {
    textAlign: 'left',
    padding: 11,
    borderBottom: '2px solid #ddd',
    whiteSpace: 'nowrap'
  },

  td: {
    padding: 11,
    borderBottom: '1px solid #eee',
    verticalAlign: 'top'
  },

  address: {
    padding: 11,
    borderBottom: '1px solid #eee',
    fontFamily: 'monospace',
    fontSize: 12,
    maxWidth: 230,
    wordBreak: 'break-all'
  },

  rowActions: {
    display: 'flex',
    gap: 7
  },

  active: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    border: '1px solid currentColor'
  },

  inactive: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    opacity: 0.55,
    border: '1px solid currentColor'
  },

  empty: {
    padding: 30,
    textAlign: 'center',
    opacity: 0.65
  },

  error: {
    padding: 12,
    marginBottom: 16,
    border: '1px solid #d33',
    borderRadius: 8
  },

  success: {
    padding: 12,
    marginBottom: 16,
    border: '1px solid #3a3',
    borderRadius: 8
  }
};
