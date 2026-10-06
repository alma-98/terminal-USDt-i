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
  updateDoc,
  where
} from "firebase/firestore";

import { db } from "../../config/firebase.js";

import {
  COLLECTIONS
} from "../../database/schema/collections.js";

import {
  validateWallet
} from "./walletValidation.js";

const walletsCollection =
  collection(
    db,
    COLLECTIONS.WALLETS
  );

async function writeAudit({
  action,
  walletId,
  user,
  metadata = {}
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
      module: "wallets",

      resourceType: "wallet",

      resourceId:
        walletId ?? null,

      result: "success",

      metadata,

      createdAt:
        serverTimestamp()
    }
  );
}

/*
 * CREATE
 */
export async function createWallet(
  data,
  user
) {
  const wallet =
    validateWallet(data);

  const docRef =
    await addDoc(
      walletsCollection,
      {
        name:
          wallet.name,

        address:
          wallet.address,

        type:
          wallet.type,

        networkId:
          wallet.networkId,

        ownerUid:
          wallet.ownerUid,

        active:
          wallet.active,

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
    action: "wallet.create",
    walletId: docRef.id,
    user,

    metadata: {
      walletType:
        wallet.type,

      networkId:
        wallet.networkId
    }
  });

  return {
    id: docRef.id,
    ...wallet
  };
}

/*
 * READ ONE
 */
export async function getWallet(
  walletId
) {
  const ref =
    doc(
      db,
      COLLECTIONS.WALLETS,
      walletId
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
export async function listWallets() {
  const q =
    query(
      walletsCollection,
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

/*
 * READ BY TYPE
 */
export async function listWalletsByType(
  type
) {
  const q =
    query(
      walletsCollection,
      where(
        "type",
        "==",
        type
      ),
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

/*
 * READ ACTIVE WALLET
 */
export async function listActiveWallets() {
  const all =
    await listWallets();

  return all.filter(
    (wallet) =>
      wallet.active === true
  );
}

/*
 * UPDATE
 */
export async function updateWallet(
  walletId,
  data,
  user
) {
  const existing =
    await getWallet(walletId);

  if (!existing) {
    throw new Error(
      "Wallet tidak ditemukan."
    );
  }

  const wallet =
    validateWallet(data);

  /*
   * Wallet type tidak diubah
   * secara sembarangan.
   *
   * Untuk perubahan tipe wallet,
   * gunakan proses khusus di masa
   * depan agar audit trail jelas.
   */
  if (
    existing.type !==
    wallet.type
  ) {
    throw new Error(
      "Wallet type tidak boleh diubah melalui Update biasa."
    );
  }

  const ref =
    doc(
      db,
      COLLECTIONS.WALLETS,
      walletId
    );

  await updateDoc(
    ref,
    {
      name:
        wallet.name,

      address:
        wallet.address,

      networkId:
        wallet.networkId,

      ownerUid:
        wallet.ownerUid,

      active:
        wallet.active,

      updatedBy:
        user?.uid ?? null,

      updatedAt:
        serverTimestamp()
    }
  );

  await writeAudit({
    action: "wallet.update",
    walletId,
    user,

    metadata: {
      walletType:
        existing.type
    }
  });

  return getWallet(walletId);
}

/*
 * ACTIVE / INACTIVE
 */
export async function setWalletActive(
  walletId,
  active,
  user
) {
  const existing =
    await getWallet(walletId);

  if (!existing) {
    throw new Error(
      "Wallet tidak ditemukan."
    );
  }

  const ref =
    doc(
      db,
      COLLECTIONS.WALLETS,
      walletId
    );

  await updateDoc(
    ref,
    {
      active:
        Boolean(active),

      updatedBy:
        user?.uid ?? null,

      updatedAt:
        serverTimestamp()
    }
  );

  await writeAudit({
    action:
      active
        ? "wallet.activate"
        : "wallet.deactivate",

    walletId,
    user,

    metadata: {
      walletType:
        existing.type
    }
  });

  return getWallet(walletId);
}

/*
 * DELETE
 */
export async function deleteWallet(
  walletId,
  user
) {
  const existing =
    await getWallet(walletId);

  if (!existing) {
    throw new Error(
      "Wallet tidak ditemukan."
    );
  }

  const ref =
    doc(
      db,
      COLLECTIONS.WALLETS,
      walletId
    );

  await deleteDoc(ref);

  await writeAudit({
    action: "wallet.delete",
    walletId,
    user,

    metadata: {
      walletType:
        existing.type
    }
  });

  return true;
}
