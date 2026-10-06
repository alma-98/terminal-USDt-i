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

import {
  COLLECTIONS
} from "../../database/schema/collections.js";

import {
  validateTenor
} from "./tenorValidation.js";

const tenorsCollection = collection(
  db,
  COLLECTIONS.TENORS
);

async function writeAudit({
  action,
  tenorId,
  user
}) {
  await addDoc(
    collection(
      db,
      COLLECTIONS.AUDIT_LOGS
    ),
    {
      actorUid:
        user?.uid ?? null,

      actorRole:
        user?.role ?? null,

      action,
      module: "tenors",

      resourceType: "tenor",
      resourceId:
        tenorId ?? null,

      result: "success",

      metadata: {},

      createdAt:
        serverTimestamp()
    }
  );
}

/*
 * CREATE
 */
export async function createTenor(
  data,
  user
) {
  /*
   * Hanya Super Admin atau permission
   * tenor.create yang boleh membuat.
   *
   * Firestore Rules tetap menjadi
   * lapisan authorization terakhir.
   */
  const tenor =
    validateTenor(data);

  const docRef =
    await addDoc(
      tenorsCollection,
      {
        ...tenor,

        createdBy:
          user?.uid ?? null,

        updatedBy:
          user?.uid ?? null,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp()
      }
    );

  await writeAudit({
    action: "tenor.create",
    tenorId: docRef.id,
    user
  });

  return {
    id: docRef.id,
    ...tenor
  };
}

/*
 * READ ONE
 */
export async function getTenor(
  tenorId
) {
  const ref = doc(
    db,
    COLLECTIONS.TENORS,
    tenorId
  );

  const snapshot =
    await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  };
}

/*
 * READ ALL
 */
export async function listTenors() {
  const q = query(
    tenorsCollection,
    orderBy(
      "days",
      "asc"
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

/*
 * READ ACTIVE ONLY
 *
 * Untuk pilihan tenor pada
 * transaksi Admin.
 */
export async function listActiveTenors() {
  const all =
    await listTenors();

  return all.filter(
    (tenor) =>
      tenor.active === true
  );
}

/*
 * UPDATE
 */
export async function updateTenor(
  tenorId,
  data,
  user
) {
  const tenor =
    validateTenor(data);

  const ref = doc(
    db,
    COLLECTIONS.TENORS,
    tenorId
  );

  await updateDoc(
    ref,
    {
      ...tenor,

      updatedBy:
        user?.uid ?? null,

      updatedAt:
        serverTimestamp()
    }
  );

  await writeAudit({
    action: "tenor.update",
    tenorId,
    user
  });

  return getTenor(tenorId);
}

/*
 * DELETE
 *
 * Penghapusan tetap dikontrol
 * oleh Firestore Rules.
 */
export async function deleteTenor(
  tenorId,
  user
) {
  const ref = doc(
    db,
    COLLECTIONS.TENORS,
    tenorId
  );

  await deleteDoc(ref);

  await writeAudit({
    action: "tenor.delete",
    tenorId,
    user
  });

  return true;
}

/*
 * ACTIVE / INACTIVE
 */
export async function setTenorActive(
  tenorId,
  active,
  user
) {
  const ref = doc(
    db,
    COLLECTIONS.TENORS,
    tenorId
  );

  await updateDoc(
    ref,
    {
      active: Boolean(active),

      updatedBy:
        user?.uid ?? null,

      updatedAt:
        serverTimestamp()
    }
  );

  await writeAudit({
    action: active
      ? "tenor.activate"
      : "tenor.deactivate",
    tenorId,
    user
  });

  return getTenor(tenorId);
}
