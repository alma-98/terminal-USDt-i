import {
  collection,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore';

import { db } from '../../config/firebase.js';
import {
  DEFAULT_NETWORK_ID,
  NETWORKS,
  getNetwork,
  getNetworkByChainId
} from './networkConstants.js';

const COLLECTION = 'networks';

export async function listNetworks() {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy('chainId', 'asc'));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return Object.values(NETWORKS);
  }

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  }));
}

export function getNetworkDefinition(networkId) {
  return getNetwork(networkId);
}

export function getNetworkByChain(chainId) {
  return getNetworkByChainId(chainId);
}

export function getDefaultNetwork() {
  return getNetwork(DEFAULT_NETWORK_ID);
}

export function assertNetworkMatch(
  coinNetworkId,
  providerNetworkId,
  walletNetworkId,
  transactionNetworkId
) {
  const values = [
    coinNetworkId,
    providerNetworkId,
    walletNetworkId,
    transactionNetworkId
  ].map((value) => String(value || '').trim());

  if (values.some((value) => !value)) {
    throw new Error(
      'Coin, Provider, Wallet, dan Transaction wajib memiliki Network.'
    );
  }

  const [coin, provider, wallet, transaction] = values;

  if (
    coin !== provider ||
    coin !== wallet ||
    coin !== transaction
  ) {
    throw new Error(
      'Network mismatch: Coin Network = Provider Network = Wallet Network = Transaction Network harus sama.'
    );
  }

  return true;
}

export function assertChainIdMatchesNetwork(
  networkId,
  chainId
) {
  const network = getNetwork(networkId);

  if (!network) {
    throw new Error(
      `Network tidak ditemukan: ${networkId}`
    );
  }

  if (Number(network.chainId) !== Number(chainId)) {
    throw new Error(
      `Chain ID ${chainId} tidak cocok dengan ${network.name} (${network.chainId}).`
    );
  }

  return true;
}
