const COLLECTION = 'swap_pairs';

const ACTIVE = 'active';
const INACTIVE = 'inactive';

const SUPPORTED_DEX = [
  'PancakeSwap',
];

const ADDRESS_REGEX =
  /^0x[a-fA-F0-9]{40}$/;

function requireSuperAdmin(user) {
  if (
    String(user?.role || '').toUpperCase() !==
    'SUPER_ADMIN'
  ) {
    throw new Error(
      'Hanya Super Admin yang dapat mengelola Swap Pair.'
    );
  }
}

function validate(input) {
  if (!input?.baseCoin) {
    throw new Error('Base Coin wajib.');
  }

  if (!input?.quoteCoin) {
    throw new Error('Quote Coin wajib.');
  }

  if (
    input.baseCoin ===
    input.quoteCoin
  ) {
    throw new Error(
      'Base Coin dan Quote Coin tidak boleh sama.'
    );
  }

  if (!input?.networkId) {
    throw new Error('Network wajib.');
  }

  if (
    !SUPPORTED_DEX.includes(input.dex)
  ) {
    throw new Error(
      'DEX tidak didukung.'
    );
  }

  if (
    !ADDRESS_REGEX.test(
      input.pairAddress || ''
    )
  ) {
    throw new Error(
      'Pair/Pool Address tidak valid.'
    );
  }

  if (
    !ADDRESS_REGEX.test(
      input.routerAddress || ''
    )
  ) {
    throw new Error(
      'Router Address tidak valid.'
    );
  }

  if (
    ![ACTIVE, INACTIVE].includes(
      input.status
    )
  ) {
    throw new Error(
      'Status Swap Pair tidak valid.'
    );
  }
}

export function createSwapPair(
  input,
  user
) {
  requireSuperAdmin(user);
  validate(input);

  return {
    collection: COLLECTION,

    baseCoin: input.baseCoin,
    quoteCoin: input.quoteCoin,

    networkId: input.networkId,

    dex: input.dex,

    pairAddress: input.pairAddress,
    routerAddress: input.routerAddress,

    status: input.status,

    createdBy: user.id || null,
    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),
  };
}

export function updateSwapPair(
  existing,
  changes,
  user
) {
  requireSuperAdmin(user);

  const updated = {
    ...existing,
    ...changes,
    updatedAt:
      new Date().toISOString(),
    updatedBy: user.id || null,
  };

  validate(updated);

  return updated;
}

export function setSwapPairStatus(
  existing,
  status,
  user
) {
  requireSuperAdmin(user);

  if (
    ![ACTIVE, INACTIVE].includes(
      status
    )
  ) {
    throw new Error(
      'Status tidak valid.'
    );
  }

  return {
    ...existing,
    status,
    updatedAt:
      new Date().toISOString(),
    updatedBy: user.id || null,
  };
}

export function canSwapWithPair(
  pair
) {
  return (
    pair &&
    pair.status === ACTIVE
  );
}

export function validatePairBeforeSwap(
  pair
) {
  if (!canSwapWithPair(pair)) {
    throw new Error(
      'Swap Pair INACTIVE atau tidak tersedia.'
    );
  }

  return true;
}

export const SWAP_PAIR_COLLECTION =
  COLLECTION;
