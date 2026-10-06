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
import { validateProvider } from './providerValidation.js';

const COLLECTION = 'providers';

function normalize(input = {}) {
  return {
    name: String(input.name || '').trim(),
    type: String(input.type || '').trim().toLowerCase(),
    network: String(input.network || '').trim().toLowerCase(),
    rpcUrl: String(input.rpcUrl || '').trim(),
    chainId: input.chainId ? Number(input.chainId) : null,
    explorerUrl: String(input.explorerUrl || '').trim(),
    status: String(input.status || 'ACTIVE').trim().toUpperCase()
  };
}

export async function listProviders() {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  }));
}

export async function createProvider(input) {
  const data = normalize(input);
  const validation = validateProvider(data);

  if (!validation.valid) {
    const error = new Error('Provider validation gagal.');
    error.validationErrors = validation.errors;
    throw error;
  }

  const snapshot = await getDocs(collection(db, COLLECTION));

  const duplicate = snapshot.docs.some((item) => {
    const existing = item.data();

    return (
      String(existing.type || '').toLowerCase() === data.type &&
      String(existing.network || '').toLowerCase() === data.network
    );
  });

  if (duplicate) {
    throw new Error(
      'Provider dengan tipe dan network tersebut sudah terdaftar.'
    );
  }

  const created = await addDoc(collection(db, COLLECTION), {
    ...data,

    /*
     * Credential rahasia TIDAK disimpan di dokumen ini.
     * API Key / API Secret harus berada di server-side environment.
     */

    credentialManagedServerSide: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return {
    id: created.id,
    ...data
  };
}

export async function updateProvider(id, input) {
  if (!id) {
    throw new Error('Provider ID tidak valid.');
  }

  const data = normalize(input);
  const validation = validateProvider(data);

  if (!validation.valid) {
    const error = new Error('Provider validation gagal.');
    error.validationErrors = validation.errors;
    throw error;
  }

  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    credentialManagedServerSide: true,
    updatedAt: serverTimestamp()
  });

  return {
    id,
    ...data
  };
}

export async function deleteProvider(id) {
  if (!id) {
    throw new Error('Provider ID tidak valid.');
  }

  await deleteDoc(doc(db, COLLECTION, id));

  return {
    id,
    deleted: true
  };
}
