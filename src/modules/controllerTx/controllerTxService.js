import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../../firebase';

export const CONTROLLER_TX_COLLECTION =
  'controllerTx';

export const CONTROLLER_TX_HASHES_COLLECTION =
  'controllerTxHashes';

export const CONTROLLER_TX_HISTORY_COLLECTION =
  'controllerTxHistory';

export async function createControllerTx({
  name,
  network,
  walletAddress,
  user,
}) {
  if (!name) {
    throw new Error('Controller TX name wajib diisi.');
  }

  if (!network) {
    throw new Error('Network wajib dipilih.');
  }

  const ref = await addDoc(
    collection(db, CONTROLLER_TX_COLLECTION),
    {
      name,
      network,
      walletAddress: walletAddress || null,
      status: 'CREATED',
      createdBy: user || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  return {
    id: ref.id,
  };
}

export async function addControllerTxHash({
  controllerTxId,
  txHash,
  network,
  user,
}) {
  if (!controllerTxId) {
    throw new Error('Controller TX wajib dipilih.');
  }

  if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
    throw new Error('TX Hash tidak valid.');
  }

  const ref = await addDoc(
    collection(
      db,
      CONTROLLER_TX_HASHES_COLLECTION,
    ),
    {
      controllerTxId,
      txHash,
      network,
      createdBy: user || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  return {
    id: ref.id,
    txHash,
  };
}

export async function listControllerTxHashes(
  controllerTxId,
) {
  const q = query(
    collection(
      db,
      CONTROLLER_TX_HASHES_COLLECTION,
    ),
    where(
      'controllerTxId',
      '==',
      controllerTxId,
    ),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function editControllerTxHash({
  hashRecordId,
  newTxHash,
  reason,
  user,
}) {
  if (!hashRecordId) {
    throw new Error('Hash record wajib dipilih.');
  }

  if (!/^0x[a-fA-F0-9]{64}$/.test(newTxHash)) {
    throw new Error('TX Hash baru tidak valid.');
  }

  if (!reason) {
    throw new Error('Reason wajib diisi.');
  }

  const hashRef = doc(
    db,
    CONTROLLER_TX_HASHES_COLLECTION,
    hashRecordId,
  );

  const snapshot = await getDocs(
    query(
      collection(
        db,
        CONTROLLER_TX_HASHES_COLLECTION,
      ),
      where('__name__', '==', hashRecordId),
    ),
  );

  if (snapshot.empty) {
    throw new Error('Hash record tidak ditemukan.');
  }

  const current = snapshot.docs[0].data();

  await updateDoc(hashRef, {
    txHash: newTxHash,
    updatedBy: user || null,
    updatedAt: serverTimestamp(),
  });

  await addDoc(
    collection(
      db,
      CONTROLLER_TX_HISTORY_COLLECTION,
    ),
    {
      controllerTxId:
        current.controllerTxId || null,

      hashRecordId,

      old: current.txHash || null,
      new: newTxHash,

      reason,
      user: user || null,
      time: serverTimestamp(),
    },
  );

  return {
    old: current.txHash,
    new: newTxHash,
  };
}

export async function deleteControllerTxHash(
  hashRecordId,
) {
  if (!hashRecordId) {
    throw new Error('Hash record wajib dipilih.');
  }

  await deleteDoc(
    doc(
      db,
      CONTROLLER_TX_HASHES_COLLECTION,
      hashRecordId,
    ),
  );

  return true;
}

export async function deleteControllerTxRecord(
  controllerTxId,
) {
  if (!controllerTxId) {
    throw new Error('Controller TX wajib dipilih.');
  }

  await deleteDoc(
    doc(
      db,
      CONTROLLER_TX_COLLECTION,
      controllerTxId,
    ),
  );

  return true;
}
