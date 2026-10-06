import {
  addDoc,
  collection,
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
  validateTransferInput
} from "./transferValidation.js";

import {
  calculateExpiresAt
} from "../allocations/allocationExpiry.js";

const transfersCollection =
  collection(
    db,
    COLLECTIONS.TRANSFERS
  );

async function getDocument(
  collectionName,
  id
) {
  const ref =
    doc(
      db,
      collectionName,
      id
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

async function writeAudit({
  action,
  transferId,
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

      module:
        "transfers",

      resourceType:
        "transfer",

      resourceId:
        transferId ?? null,

      result:
        "success",

      metadata,

      createdAt:
        serverTimestamp()
    }
  );
}

/*
 * CREATE TRANSFER
 *
 * Tahap ini membuat record transfer
 * dan allocation expiry.
 *
 * Belum broadcast blockchain.
 */
export async function createTransfer({
  data,
  user
}) {
  const input =
    validateTransferInput(
      data
    );

  const coin =
    await getDocument(
      COLLECTIONS.COINS,
      input.coinId
    );

  if (!coin) {
    throw new Error(
      "Coin tidak ditemukan."
    );
  }

  if (coin.active !== true) {
    throw new Error(
      "Coin tidak aktif."
    );
  }

  const wallet =
    await getDocument(
      COLLECTIONS.WALLETS,
      input.destinationWalletId
    );

  if (!wallet) {
    throw new Error(
      "Destination wallet tidak ditemukan."
    );
  }

  if (
    wallet.type !==
    "destination"
  ) {
    throw new Error(
      "Wallet yang dipilih bukan destination wallet."
    );
  }

  if (wallet.active !== true) {
    throw new Error(
      "Destination wallet tidak aktif."
    );
  }

  const tenor =
    await getDocument(
      COLLECTIONS.TENORS,
      input.tenorId
    );

  if (!tenor) {
    throw new Error(
      "Tenor tidak ditemukan."
    );
  }

  if (tenor.active !== true) {
    throw new Error(
      "Tenor tidak aktif."
    );
  }

  const startAt =
    new Date();

  const expiresAt =
    calculateExpiresAt(
      startAt,
      Number(tenor.days)
    );

  /*
   * Allocation dibuat bersamaan
   * dengan transfer.
   *
   * expiresAt independen untuk
   * allocation tersebut.
   */
  const allocationRef =
    await addDoc(
      collection(
        db,
        COLLECTIONS.ALLOCATIONS
      ),
      {
        walletId:
          wallet.id,

        coinId:
          coin.id,

        tenorId:
          tenor.id,

        amount:
          input.amount,

        startAt,

        tenorDays:
          Number(tenor.days),

        expiresAt,

        expiryStatus:
          "active",

        status:
          "active",

        createdBy:
          user?.uid ?? null,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp()
      }
    );

  /*
   * Transaction record.
   *
   * txHash masih null karena
   * blockchain provider belum
   * digunakan pada tahap ini.
   */
  const transactionRef =
    await addDoc(
      collection(
        db,
        COLLECTIONS.TRANSACTIONS
      ),
      {
        transferId:
          null,

        allocationId:
          allocationRef.id,

        coinId:
          coin.id,

        walletId:
          wallet.id,

        networkId:
          wallet.networkId,

        amount:
          input.amount,

        txHash:
          null,

        etherscanUrl:
          null,

        status:
          "pending",

        createdBy:
          user?.uid ?? null,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp()
      }
    );

  /*
   * Transfer record.
   */
  const transferRef =
    await addDoc(
      transfersCollection,
      {
        coinId:
          coin.id,

        destinationWalletId:
          wallet.id,

        tenorId:
          tenor.id,

        allocationId:
          allocationRef.id,

        transactionId:
          transactionRef.id,

        amount:
          input.amount,

        startAt,

        expiresAt,

        tenorDays:
          Number(tenor.days),

        status:
          "review",

        txHash:
          null,

        etherscanUrl:
          null,

        reviewRequired:
          true,

        createdBy:
          user?.uid ?? null,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp()
      }
    );

  /*
   * Hubungkan transaction ke
   * transfer setelah transfer ID
   * tersedia.
   */
  await updateDoc(
    doc(
      db,
      COLLECTIONS.TRANSACTIONS,
      transactionRef.id
    ),
    {
      transferId:
        transferRef.id,

      updatedAt:
        serverTimestamp()
    }
  );

  await writeAudit({
    action:
      "transfer.create",

    transferId:
      transferRef.id,

    user,

    metadata: {
      coinId:
        coin.id,

      walletId:
        wallet.id,

      tenorId:
        tenor.id,

      allocationId:
        allocationRef.id,

      transactionId:
        transactionRef.id
    }
  });

  return {
    transferId:
      transferRef.id,

    allocationId:
      allocationRef.id,

    transactionId:
      transactionRef.id,

    coinId:
      coin.id,

    walletId:
      wallet.id,

    tenorId:
      tenor.id,

    amount:
      input.amount,

    startAt,

    expiresAt,

    status:
      "review",

    txHash:
      null
  };
}

/*
 * REVIEW
 *
 * Transfer harus melewati
 * review sebelum confirm.
 */
export async function reviewTransfer(
  transferId,
  user
) {
  const transfer =
    await getDocument(
      COLLECTIONS.TRANSFERS,
      transferId
    );

  if (!transfer) {
    throw new Error(
      "Transfer tidak ditemukan."
    );
  }

  return {
    ...transfer,

    reviewRequired:
      true
  };
}

/*
 * CONFIRM REVIEW
 *
 * Pada tahap ini hanya mengubah
 * status menjadi pending.
 *
 * Broadcast blockchain dilakukan
 * setelah provider/signing tersedia.
 */
export async function confirmTransfer(
  transferId,
  user
) {
  const transfer =
    await getDocument(
      COLLECTIONS.TRANSFERS,
      transferId
    );

  if (!transfer) {
    throw new Error(
      "Transfer tidak ditemukan."
    );
  }

  if (
    transfer.status !==
    "review"
  ) {
    throw new Error(
      "Transfer tidak berada pada status review."
    );
  }

  await updateDoc(
    doc(
      db,
      COLLECTIONS.TRANSFERS,
      transferId
    ),
    {
      status:
        "pending",

      reviewRequired:
        false,

      updatedBy:
        user?.uid ?? null,

      updatedAt:
        serverTimestamp()
    }
  );

  if (transfer.transactionId) {
    await updateDoc(
      doc(
        db,
        COLLECTIONS.TRANSACTIONS,
        transfer.transactionId
      ),
      {
        status:
          "pending",

        updatedAt:
          serverTimestamp()
      }
    );
  }

  await writeAudit({
    action:
      "transfer.confirm",

    transferId,

    user
  });

  return {
    ...transfer,

    status:
      "pending",

    reviewRequired:
      false
  };
}

/*
 * CANCEL
 */
export async function cancelTransfer(
  transferId,
  user
) {
  const transfer =
    await getDocument(
      COLLECTIONS.TRANSFERS,
      transferId
    );

  if (!transfer) {
    throw new Error(
      "Transfer tidak ditemukan."
    );
  }

  if (
    [
      "confirmed",
      "submitted"
    ].includes(
      transfer.status
    )
  ) {
    throw new Error(
      "Transfer yang sudah dikirim tidak dapat dibatalkan dari workflow ini."
    );
  }

  await updateDoc(
    doc(
      db,
      COLLECTIONS.TRANSFERS,
      transferId
    ),
    {
      status:
        "cancelled",

      updatedBy:
        user?.uid ?? null,

      updatedAt:
        serverTimestamp()
    }
  );

  if (transfer.transactionId) {
    await updateDoc(
      doc(
        db,
        COLLECTIONS.TRANSACTIONS,
        transfer.transactionId
      ),
      {
        status:
          "failed",

        updatedAt:
          serverTimestamp()
      }
    );
  }

  await writeAudit({
    action:
      "transfer.cancel",

    transferId,

    user
  });

  return true;
}

/*
 * LIST TRANSFERS
 */
export async function listTransfers() {
  const q =
    query(
      transfersCollection,
      orderBy(
        "createdAt",
        "desc"
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
