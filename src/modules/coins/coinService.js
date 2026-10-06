import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";

import { db } from "../../config/firebase.js";
import { COLLECTIONS } from "../../database/schema/collections.js";
import {
  normalizeCoin
} from "./coinValidation.js";

const coinsCollection = collection(
  db,
  COLLECTIONS.COINS
);

function auditData({
  action,
  coinId,
  user
}) {
  return {
    actorUid: user?.uid ?? null,
    actorRole: user?.role ?? null,

    action,
    module: "coins",

    resourceType: "coin",
    resourceId: coinId ?? null,

    result: "success",

    metadata: {},

    createdAt: serverTimestamp()
  };
}

async function writeAudit({
  action,
  coinId,
  user
}) {
  await addDoc(
    collection(
      db,
      COLLECTIONS.AUDIT_LOGS
    ),
    auditData({
      action,
      coinId,
      user
    })
  );
}

export async function createCoin(
  data,
  user
) {
  const coin = normalizeCoin(data);

  const docRef = await addDoc(
    coinsCollection,
    {
      ...coin,

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),

      createdBy:
        user?.uid ?? null,

      updatedBy:
        user?.uid ?? null
    }
  );

  await writeAudit({
    action: "coin.create",
    coinId: docRef.id,
    user
  });

  return {
    id: docRef.id,
    ...coin
  };
}

export async function getCoin(
  coinId
) {
  const ref = doc(
    db,
    COLLECTIONS.COINS,
    coinId
  );

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  };
}

export async function listCoins() {
  const q = query(
    coinsCollection,
    orderBy(
      "createdAt",
      "desc"
    )
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (item) => ({
      id: item.id,
      ...item.data()
    })
  );
}

export async function updateCoin(
  coinId,
  data,
  user
) {
  const coin = normalizeCoin(data);

  const ref = doc(
    db,
    COLLECTIONS.COINS,
    coinId
  );

  await updateDoc(ref, {
    ...coin,

    updatedAt:
      serverTimestamp(),

    updatedBy:
      user?.uid ?? null
  });

  await writeAudit({
    action: "coin.update",
    coinId,
    user
  });

  return getCoin(coinId);
}

export async function deleteCoin(
  coinId,
  user
) {
  const ref = doc(
    db,
    COLLECTIONS.COINS,
    coinId
  );

  await deleteDoc(ref);

  await writeAudit({
    action: "coin.delete",
    coinId,
    user
  });

  return true;
}

export async function setCoinActive(
  coinId,
  active,
  user
) {
  const ref = doc(
    db,
    COLLECTIONS.COINS,
    coinId
  );

  await updateDoc(ref, {
    active: Boolean(active),

    updatedAt:
      serverTimestamp(),

    updatedBy:
      user?.uid ?? null
  });

  await writeAudit({
    action: active
      ? "coin.activate"
      : "coin.deactivate",
    coinId,
    user
  });

  return getCoin(coinId);
}

export async function setCoinPaused(
  coinId,
  paused,
  user
) {
  const ref = doc(
    db,
    COLLECTIONS.COINS,
    coinId
  );

  await updateDoc(ref, {
    paused: Boolean(paused),

    updatedAt:
      serverTimestamp(),

    updatedBy:
      user?.uid ?? null
  });

  await writeAudit({
    action: paused
      ? "coin.pause"
      : "coin.unpause",
    coinId,
    user
  });

  return getCoin(coinId);
}
