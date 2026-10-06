import {
  SWAP_PAIR_STATUS,
  SUPPORTED_DEX,
} from './swapPairConfig.js';

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export function validateAddress(address, fieldName) {
  if (!address || !ADDRESS_REGEX.test(address)) {
    throw new Error(`${fieldName} harus berupa address EVM yang valid.`);
  }

  return true;
}

export function validateSwapPairInput(input) {
  if (!input?.baseCoin) {
    throw new Error('Base Coin wajib dipilih.');
  }

  if (!input?.quoteCoin) {
    throw new Error('Quote Coin wajib dipilih.');
  }

  if (input.baseCoin === input.quoteCoin) {
    throw new Error('Base Coin dan Quote Coin tidak boleh sama.');
  }

  if (!input?.networkId) {
    throw new Error('Network wajib dipilih.');
  }

  if (!input?.dex) {
    throw new Error('DEX wajib dipilih.');
  }

  if (!SUPPORTED_DEX.includes(input.dex)) {
    throw new Error(`DEX ${input.dex} belum didukung.`);
  }

  validateAddress(
    input.pairAddress,
    'Pair/Pool Address'
  );

  validateAddress(
    input.routerAddress,
    'Router Address'
  );

  const status =
    input.status || SWAP_PAIR_STATUS.ACTIVE;

  if (
    !Object.values(SWAP_PAIR_STATUS).includes(status)
  ) {
    throw new Error('Status Swap Pair tidak valid.');
  }

  return true;
}

export function canUseSwapPair(pair) {
  if (!pair) return false;

  return (
    pair.status === SWAP_PAIR_STATUS.ACTIVE
  );
}

export function assertActiveSwapPair(pair) {
  if (!pair) {
    throw new Error('Swap Pair tidak ditemukan.');
  }

  if (!canUseSwapPair(pair)) {
    throw new Error(
      'Swap Pair INACTIVE dan tidak dapat digunakan untuk Swap.'
    );
  }

  return true;
}
