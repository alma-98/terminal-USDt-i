import React from 'react';
import { buildNetworkFeeView } from '../../modules/networkFee/networkFeeViewModel.js';

export default function NetworkFeeSummary({
  role,
  fee,
}) {
  const view = buildNetworkFeeView({
    role,
    fee,
  });

  if (!view) return null;

  const normalizedRole =
    String(role || '').trim().toUpperCase();

  return (
    <section>
      <h3>{view.label}</h3>

      <div>
        {view.value}
      </div>

      {normalizedRole === 'SUPER_ADMIN' && (
        <div>
          <div>
            Amount:
            {' '}
            {view.amount}
          </div>

          <div>
            Fee Internal:
            {' '}
            {view.networkFee}
          </div>

          <div>
            Net Amount:
            {' '}
            {view.netAmount}
          </div>

          <div>
            Recipient Internal:
            {' '}
            {view.recipient}
          </div>

          <div>
            Recipient Role:
            {' '}
            {view.recipientRole}
          </div>

          <div>
            Status:
            {' '}
            {view.status}
          </div>
        </div>
      )}
    </section>
  );
}
