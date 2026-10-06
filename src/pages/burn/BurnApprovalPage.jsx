import React, { useState } from 'react';
import {
  approveBurnWithReauth,
  rejectBurnWithReauth,
} from '../../modules/burn/burnApprovalService.js';

export default function BurnApprovalPage({
  request,
  role = 'Admin',
  verifyReauth,
  audit,
}) {
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  if (role !== 'Super Admin') {
    return (
      <section>
        <h1>Burn Approval</h1>
        <p>Hanya Super Admin yang dapat melakukan approval burn.</p>
      </section>
    );
  }

  if (!request || request.status !== 'PENDING') {
    return (
      <section>
        <h1>Burn Approval</h1>
        <p>Tidak ada Burn Request PENDING.</p>
      </section>
    );
  }

  async function handleApprove() {
    setError('');
    setStatus('');

    try {
      const result = await approveBurnWithReauth({
        request,
        password,
        verifyReauth,
        audit,
      });

      setPassword('');
      setStatus(`Burn ${result.status}`);
    } catch (err) {
      setPassword('');
      setError(err.message);
    }
  }

  async function handleReject() {
    setError('');
    setStatus('');

    try {
      const result = await rejectBurnWithReauth({
        request,
        password,
        reason,
        verifyReauth,
        audit,
      });

      setPassword('');
      setStatus(`Burn ${result.status}`);
    } catch (err) {
      setPassword('');
      setError(err.message);
    }
  }

  return (
    <section>
      <h1>Burn Approval</h1>

      <p>
        Request: <strong>{request.id || '-'}</strong>
      </p>

      <p>
        Status: <strong>{request.status}</strong>
      </p>

      <hr />

      <h2>Re-authentication</h2>

      <p>
        Masukkan password Super Admin untuk melanjutkan
        aksi sensitif.
      </p>

      <input
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password Super Admin"
      />

      <br />
      <br />

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Alasan reject jika memilih Reject"
      />

      <br />
      <br />

      <button type="button" onClick={handleApprove}>
        Re-authenticate & Approve
      </button>

      <button type="button" onClick={handleReject}>
        Re-authenticate & Reject
      </button>

      {status && <p>{status}</p>}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
