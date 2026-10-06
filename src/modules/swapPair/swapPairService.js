import {
  SWAP_PAIR_COLLECTION,
  SWAP_PAIR_STATUS,
} from './swapPairConfig.js';

import {
  validateSwapPairInput,
  assertActiveSwapPair,
} from './swapPairValidation.js';

export function createSwapPair(input, user) {
  if (
    String(user?.role || '').toUpperCase() !==
    'SUPER_ADMIN'
  ) {
    throw new Error(
      'Hanya Super Admin yang dapat membuat Swap Pair.'
    );
  }

  validateSwapPairInput(input);

  return {
    baseCoin: input.baseCoin,
    quoteCoin: input.quoteCoin,

    networkId: input.networkId,

    dex: input.dex,

    pairAddress: input.pairAddress,

    routerAddress: input.routerAddress,

    status:
      input.status || SWAP_PAIR_STATUS.ACTIVE,

    createdBy: user.id || null,

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  };
}

export function updateSwapPair(pair, changes, user) {
  if (
    String(user?.role || '').toUpperCase() !==
    'SUPER_ADMIN'
  ) {
    throw new Error(
      'Hanya Super Admin yang dapat mengubah Swap Pair.'
    );
  }

  const updated = {
    ...pair,
    ...changes,
    updatedAt: new Date().toISOString(),
    updatedBy: user.id || null,
  };

  validateSwapPairInput(updated);

  return updated;
}

export function setSwapPairStatus(pair, status, user) {
  if (
    String(user?.role || '').toUpperCase() !==
    'SUPER_ADMIN'
  ) {
    throw new Error(
      'Hanya Super Admin yang dapat mengubah status Swap Pair.'
    );
  }

  if (
    !Object.values(SWAP_PAIR_STATUS).includes(status)
  ) {
    throw new Error('Status Swap Pair tidak valid.');
  }

  return {
    ...pair,
    status,
    updatedAt: new Date().toISOString(),
    updatedBy: user.id || null,
  };
}

export function deleteSwapPair(pair, user) {
  if (
    String(user?.role || '').toUpperCase() !==
    'SUPER_ADMIN'
  ) {
    throw new Error(
      'Hanya Super Admin yang dapat menghapus Swap Pair.'
    );
  }

  return {
    ...pair,
    deleted: true,
    deletedAt: new Date().toISOString(),
    deletedBy: user.id || null,
    status: SWAP_PAIR_STATUS.INACTIVE,
  };
}

export function validatePairBeforeSwap(pair) {
  assertActiveSwapPair(pair);
  return true;
}

export function getSwapPairCollection() {
  return SWAP_PAIR_COLLECTION;
}
