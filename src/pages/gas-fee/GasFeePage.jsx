import React, { useMemo } from 'react';
import {
  GAS_FEE_CONFIG,
  calculateDeployerFee
} from '../../modules/gasFee';

export default function GasFeePage({
  gasFeeWei = '0',
  gasFeeNative = '0',
  network = 'Ethereum Mainnet',
  chainId = 1
}) {
  const deployerFeeWei = useMemo(() => {
    try {
      return calculateDeployerFee(gasFeeWei).toString();
    } catch {
      return '0';
    }
  }, [gasFeeWei]);

  return (
    <div style={{
      padding: 24,
      color: '#fff',
      background: '#0b0b0b',
      minHeight: '100%'
    }}>
      <h2>{GAS_FEE_CONFIG.displayLabel}</h2>

      <div style={{ marginTop: 20 }}>
        <div>Network</div>
        <strong>{network}</strong>
      </div>

      <div style={{ marginTop: 16 }}>
        <div>Chain ID</div>
        <strong>{chainId}</strong>
      </div>

      <div style={{ marginTop: 16 }}>
        <div>Actual Blockchain Gas Fee</div>
        <strong>{gasFeeNative}</strong>
      </div>

      <div style={{ marginTop: 16 }}>
        <div>Deployer Allocation</div>
        <strong>{GAS_FEE_CONFIG.allocationPercent}%</strong>
      </div>

      <div style={{ marginTop: 16 }}>
        <div>Deployer Wallet</div>
        <code>{GAS_FEE_CONFIG.deployerWallet}</code>
      </div>

      <div style={{ marginTop: 16 }}>
        <div>Deployer Fee (Wei)</div>
        <strong>{deployerFeeWei}</strong>
      </div>

      <div style={{
        marginTop: 20,
        padding: 14,
        border: '1px solid #333',
        borderRadius: 8
      }}>
        <strong>Gas Fee Mainnet From Blockchain</strong>
        <div style={{ marginTop: 6 }}>
          50% allocation → Deployer Wallet
        </div>
      </div>
    </div>
  );
}
