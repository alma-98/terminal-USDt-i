import {
  DEFAULT_NETWORK_ID,
  NETWORKS
} from './networkConstants.js';

export function validateNetwork(input = {}) {
  const errors = {};

  const id = String(input.id || '').trim();
  const name = String(input.name || '').trim();
  const chainId = Number(input.chainId || 0);
  const explorerUrl = String(input.explorerUrl || '').trim();

  if (!id) {
    errors.id = 'Network ID wajib diisi.';
  }

  if (!name) {
    errors.name = 'Network Name wajib diisi.';
  }

  if (!chainId || chainId <= 0) {
    errors.chainId = 'Chain ID wajib diisi.';
  }

  if (!explorerUrl) {
    errors.explorerUrl = 'Explorer URL wajib diisi.';
  }

  const existing = NETWORKS[id];

  if (
    existing &&
    Number(existing.chainId) !== chainId
  ) {
    errors.chainId =
      `Chain ID untuk ${id} harus ${existing.chainId}.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateNetworkReference(networkId) {
  const normalized = String(networkId || '').trim();

  if (!normalized) {
    throw new Error('Network ID wajib diisi.');
  }

  const network = NETWORKS[normalized];

  if (!network) {
    throw new Error(
      `Network tidak terdaftar: ${normalized}`
    );
  }

  if (!network.active) {
    throw new Error(
      `Network tidak aktif: ${network.name}`
    );
  }

  return network;
}

export function isDefaultNetwork(networkId) {
  return (
    String(networkId || '').trim() ===
    DEFAULT_NETWORK_ID
  );
}
