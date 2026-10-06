import React from 'react';

export default function AuditLogPage({
  records = [],
  role = 'Admin',
}) {
  return (
    <section>
      <h1>Audit Log</h1>

      <p>
        Activity records bersifat immutable-style.
      </p>

      {records.length === 0 ? (
        <p>Belum ada audit record.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Object</th>
              <th>Old</th>
              <th>New</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.timestamp}</td>
                <td>{record.userId}</td>
                <td>{record.role}</td>
                <td>{record.action}</td>
                <td>
                  {record.objectType}
                  {record.objectId
                    ? ` / ${record.objectId}`
                    : ''}
                </td>
                <td>
                  {record.oldValue
                    ? JSON.stringify(record.oldValue)
                    : '-'}
                </td>
                <td>
                  {record.newValue
                    ? JSON.stringify(record.newValue)
                    : '-'}
                </td>
                <td>{record.status}</td>
                <td>{record.reason || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
