import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../../firebase';

export const TRANSACTION_HASHES_COLLECTION =
  'transactionHashes';

export const HASH_HISTORY_COLLECTION =
  'hashHistory';

export async function createHashRecord({
  transactionId,
  hashNumber,
  hash,
  user,
}) {
  const number = Number(hashNumber);

  if (!Number.isInteger(number) || number < 1) {
    throw new Error('Hash number minimal 1.');
  }

  const ref = await addDoc(
    collection(db, TRANSACTION_HASHES_COLLECTION),
    {
      transactionId,
      hashId: `Hash #${number}`,
      hashNumber: number,
      hash,
      user: user || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  return {
    id: ref.id,
    hashId: `Hash #${number}`,
  };
}

export async function editHashRecord({
  hashRecordId,
  newHash,
  reason,
  user,
}) {
  if (!hashRecordId) {
    throw new Error('Hash record wajib dipilih.');
  }

  if (!newHash) {
    throw new Error('Hash baru wajib diisi.');
  }

  if (!reason) {
    throw new Error('Reason wajib diisi.');
  }

  if (!user) {
    throw new Error('User wajib tersedia.');
  }

  const hashRef = doc(
    db,
    TRANSACTION_HASHES_COLLECTION,
    hashRecordId,
  );

  const snapshot = await getDoc(hashRef);

  if (!snapshot.exists()) {
    throw new Error('Hash record tidak ditemukan.');
  }

  const current = snapshot.data();
  const oldHash = current.hash || null;

  await updateDoc(hashRef, {
    hash: newHash,
    updatedAt: serverTimestamp(),
    updatedBy: user,
  });

  await addDoc(
    collection(db, HASH_HISTORY_COLLECTION),
    {
      transactionId: current.transactionId || null,
      hashRecordId,
      hashId: current.hashId || null,
      old: oldHash,
      new: newHash,
      reason,
      user,
      time: serverTimestamp(),
    },
  );

  return {
    hashId: current.hashId,
    old: oldHash,
    new: newHash,
  };
}
