const EVM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export function validateSwapPair(input = {}) {
  const errors = {};

  const baseCoin = String(input.baseCoin || '').trim();
  const quoteCoin = String(input.quoteCoin || '').trim();
  const network = String(input.network || '').trim();
  const dex = String(input.dex || '').trim();
  const pairPoolAddress = String(input.pairPoolAddress || '').trim();
  const router = String(input.router || '').trim();
  const status = String(input.status || '').trim().toUpperCase();

  if (!baseCoin) errors.baseCoin = 'Base Coin wajib diisi.';
  if (!quoteCoin) errors.quoteCoin = 'Quote Coin wajib diisi.';
  if (!network) errors.network = 'Network wajib diisi.';
  if (!dex) errors.dex = 'DEX wajib diisi.';
  if (!pairPoolAddress) {
    errors.pairPoolAddress = 'Pair/Pool Address wajib diisi.';
  } else if (!EVM_ADDRESS.test(pairPoolAddress)) {
    errors.pairPoolAddress = 'Pair/Pool Address harus alamat EVM yang valid.';
  }

  if (!router) {
    errors.router = 'Router wajib diisi.';
  } else if (!EVM_ADDRESS.test(router)) {
    errors.router = 'Router harus alamat EVM yang valid.';
  }

  if (!['ACTIVE', 'INACTIVE'].includes(status)) {
    errors.status = 'Status harus ACTIVE atau INACTIVE.';
  }

  if (
    baseCoin &&
    quoteCoin &&
    baseCoin.toLowerCase() === quoteCoin.toLowerCase()
  ) {
    errors.quoteCoin = 'Base Coin dan Quote Coin tidak boleh sama.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
