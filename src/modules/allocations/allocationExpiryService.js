import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../../config/firebase.js";

import {
  COLLECTIONS
} from "../../database/schema/collections.js";

import {
  calculateExpiresAt,
  getExpiryStatus
} from "./allocationExpiry.js";

function allocationRef(
  allocationId
) {
  return doc(
    db,
    COLLECTIONS.ALLOCATIONS,
    allocationId
  );
}

/*
 * Menghitung expiry berdasarkan
 * startAt + tenorDays.
 *
 * expiresAt disimpan pada allocation
 * masing-masing.
 */
export async function setAllocationExpiry({
  allocationId,
  startAt,
  tenorDays,
  user
}) {
  if (!allocationId) {
    throw new Error(
      "allocationId wajib diisi."
    );
  }

  const ref =
    allocationRef(
      allocationId
    );

  const snapshot =
    await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error(
      "Allocation tidak ditemukan."
    );
  }

  const expiresAt =
    calculateExpiresAt(
      startAt,
      tenorDays
    );

  await updateDoc(
    ref,
    {
      startAt:
        new Date(startAt),

      tenorDays:
        Number(tenorDays),

      expiresAt,

      expiryStatus:
        getExpiryStatus(
          expiresAt
        ),

      updatedBy:
        user?.uid ?? null,

      updatedAt:
        serverTimestamp()
    }
  );

  return {
    allocationId,

    startAt:
      new Date(startAt),

    tenorDays:
      Number(tenorDays),

    expiresAt,

    expiryStatus:
      getExpiryStatus(
        expiresAt
      )
  };
}

/*
 * Refresh status expiry.
 *
 * Tidak mengubah startAt atau
 * expiresAt.
 */
export async function refreshAllocationExpiry(
  allocationId
) {
  const ref =
    allocationRef(
      allocationId
    );

  const snapshot =
    await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error(
      "Allocation tidak ditemukan."
    );
  }

  const data =
    snapshot.data();

  if (!data.expiresAt) {
    throw new Error(
      "Allocation belum memiliki expiresAt."
    );
  }

  const status =
    getExpiryStatus(
      data.expiresAt.toDate
        ? data.expiresAt.toDate()
        : data.expiresAt
    );

  if (
    data.expiryStatus !== status
  ) {
    await updateDoc(
      ref,
      {
        expiryStatus:
          status,

        updatedAt:
          serverTimestamp()
      }
    );
  }

  return {
    id:
      snapshot.id,

    ...data,

    expiryStatus:
      status
  };
}

/*
 * Semua allocation yang
 * sudah expired.
 */
export async function listExpiredAllocations() {
  const q =
    query(
      collection(
        db,
        COLLECTIONS.ALLOCATIONS
      ),
      where(
        "expiresAt",
        "<=",
        new Date()
      )
    );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (item) => ({
      id:
        item.id,

      ...item.data(),

      expiryStatus:
        "expired"
    })
  );
}

/*
 * Semua allocation untuk
 * wallet tertentu.
 *
 * Expiry tetap independen
 * pada setiap allocation.
 */
export async function listWalletAllocations(
  walletId
) {
  if (!walletId) {
    throw new Error(
      "walletId wajib diisi."
    );
  }

  const q =
    query(
      collection(
        db,
        COLLECTIONS.ALLOCATIONS
      ),
      where(
        "walletId",
        "==",
        walletId
      )
    );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (item) => ({
      id:
        item.id,

      ...item.data()
    })
  );
}
