import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

import { db } from '../../config/firebase.js';
import { validateSwapPair } from './swapPairValidation.js';

const COLLECTION = 'swap_pairs';

function normalize(value) {
  return String(value || '').trim();
}

function normalizePair(data = {}) {
  return {
    baseCoin: normalize(data.baseCoin),
    quoteCoin: normalize(data.quoteCoin),
    network: normalize(data.network),
    dex: normalize(data.dex),
    pairPoolAddress: normalize(data.pairPoolAddress),
    router: normalize(data.router),
    status: normalize(data.status).toUpperCase()
  };
}

export async function listSwapPairs() {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  }));
}

export async function createSwapPair(input) {
  const data = normalizePair(input);
  const validation = validateSwapPair(data);

  if (!validation.valid) {
    const error = new Error('Swap Pair validation gagal.');
    error.validationErrors = validation.errors;
    throw error;
  }

  const ref = collection(db, COLLECTION);

  const duplicateSnapshot = await getDocs(ref);

  const duplicate = duplicateSnapshot.docs.some((item) => {
    const existing = item.data();

    return (
      normalize(existing.baseCoin).toLowerCase() === data.baseCoin.toLowerCase() &&
      normalize(existing.quoteCoin).toLowerCase() === data.quoteCoin.toLowerCase() &&
      normalize(existing.network).toLowerCase() === data.network.toLowerCase() &&
      normalize(existing.dex).toLowerCase() === data.dex.toLowerCase()
    );
  });

  if (duplicate) {
    throw new Error(
      'Swap Pair dengan Base Coin, Quote Coin, Network, dan DEX yang sama sudah ada.'
    );
  }

  const created = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return {
    id: created.id,
    ...data
  };
}

export async function updateSwapPair(id, input) {
  if (!id) {
    throw new Error('Swap Pair ID tidak valid.');
  }

  const data = normalizePair(input);
  const validation = validateSwapPair(data);

  if (!validation.valid) {
    const error = new Error('Swap Pair validation gagal.');
    error.validationErrors = validation.errors;
    throw error;
  }

  const ref = doc(db, COLLECTION, id);

  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp()
  });

  return {
    id,
    ...data
  };
}

export async function deleteSwapPair(id) {
  if (!id) {
    throw new Error('Swap Pair ID tidak valid.');
  }

  await deleteDoc(doc(db, COLLECTION, id));

  return {
    id,
    deleted: true
  };
}
