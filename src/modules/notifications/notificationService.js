import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
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
  NOTIFICATION_EVENTS,
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPES
} from "./notificationEvents.js";

import {
  validateNotificationInput
} from "./notificationValidation.js";

const notificationsCollection =
  collection(
    db,
    COLLECTIONS.NOTIFICATIONS
  );

/*
 * Semua notification tahap 17
 * ditujukan kepada Super Admin.
 *
 * recipientUid harus berasal dari
 * sistem role/authentication.
 */
export async function createAdminTransactionNotification({
  eventType,
  type = NOTIFICATION_TYPES.TRANSACTION,
  title,
  message,
  actorUid,
  actorRole,
  resourceId = null,
  resourceType = null,
  transactionId = null,
  transferId = null,
  metadata = {},
  superAdminUid
}) {
  if (!superAdminUid) {
    throw new Error(
      "Super Admin UID wajib tersedia."
    );
  }

  const data = {
    recipientUid:
      superAdminUid,

    actorUid,

    actorRole,

    eventType,

    type,

    title,

    message,

    resourceId,

    resourceType,

    transactionId,

    transferId,

    metadata,

    status:
      NOTIFICATION_STATUS.UNREAD,

    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp()
  };

  validateNotificationInput(
    data
  );

  /*
   * Deduplikasi sederhana.
   *
   * Event yang sama untuk resource
   * yang sama tidak dibuat berulang
   * apabila notification pending
   * masih tersedia.
   */
  const duplicateQuery =
    query(
      notificationsCollection,

      where(
        "recipientUid",
        "==",
        superAdminUid
      ),

      where(
        "eventType",
        "==",
        eventType
      ),

      where(
        "resourceId",
        "==",
        resourceId
      ),

      limit(1)
    );

  const duplicateSnapshot =
    await getDocs(
      duplicateQuery
    );

  if (
    !duplicateSnapshot.empty
  ) {
    return {
      created: false,

      duplicate: true,

      id:
        duplicateSnapshot
          .docs[0]
          .id
    };
  }

  const ref =
    await addDoc(
      notificationsCollection,
      data
    );

  return {
    created: true,

    duplicate: false,

    id:
      ref.id
  };
}

/*
 * Transfer Admin
 */
export async function notifyTransfer(
  payload
) {
  return createAdminTransactionNotification({
    ...payload,

    eventType:
      NOTIFICATION_EVENTS.TRANSFER,

    type:
      NOTIFICATION_TYPES.TRANSACTION,

    title:
      "Admin melakukan Transfer",

    message:
      payload.message ??
      "Admin membuat atau melakukan transfer."
  });
}

/*
 * Swap Admin
 */
export async function notifySwap(
  payload
) {
  return createAdminTransactionNotification({
    ...payload,

    eventType:
      NOTIFICATION_EVENTS.SWAP,

    type:
      NOTIFICATION_TYPES.TRANSACTION,

    title:
      "Admin melakukan Swap",

    message:
      payload.message ??
      "Admin membuat atau melakukan swap."
  });
}

/*
 * Burn Request Admin
 */
export async function notifyBurnRequest(
  payload
) {
  return createAdminTransactionNotification({
    ...payload,

    eventType:
      NOTIFICATION_EVENTS.BURN_REQUEST,

    type:
      NOTIFICATION_TYPES.TRANSACTION,

    title:
      "Admin membuat Burn Request",

    message:
      payload.message ??
      "Admin membuat burn request."
  });
}

/*
 * Hash edit.
 */
export async function notifyHashEdit(
  payload
) {
  return createAdminTransactionNotification({
    ...payload,

    eventType:
      NOTIFICATION_EVENTS.HASH_EDIT,

    type:
      NOTIFICATION_TYPES.AUDIT,

    title:
      "Transaction Hash diubah",

    message:
      payload.message ??
      "Admin mengubah transaction hash."
  });
}

/*
 * Blockchain transaction.
 */
export async function notifyBlockchainTransaction(
  payload
) {
  return createAdminTransactionNotification({
    ...payload,

    eventType:
      NOTIFICATION_EVENTS.BLOCKCHAIN_TRANSACTION,

    type:
      NOTIFICATION_TYPES.TRANSACTION,

    title:
      "Admin melakukan transaksi blockchain",

    message:
      payload.message ??
      "Transaksi blockchain dilakukan oleh Admin."
  });
}

/*
 * Daftar notification milik
 * Super Admin.
 */
export async function listSuperAdminNotifications(
  superAdminUid
) {
  if (!superAdminUid) {
    throw new Error(
      "Super Admin UID wajib diisi."
    );
  }

  const q =
    query(
      notificationsCollection,

      where(
        "recipientUid",
        "==",
        superAdminUid
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
      id:
        item.id,

      ...item.data()
    })
  );
}

/*
 * Tandai notification sebagai read.
 *
 * Hanya recipient yang seharusnya
 * boleh melakukan operasi ini.
 * Security Rules tetap menjadi
 * pengaman utama.
 */
export async function markNotificationRead(
  notificationId,
  currentUid
) {
  if (!notificationId) {
    throw new Error(
      "notificationId wajib diisi."
    );
  }

  if (!currentUid) {
    throw new Error(
      "currentUid wajib diisi."
    );
  }

  const ref =
    doc(
      db,
      COLLECTIONS.NOTIFICATIONS,
      notificationId
    );

  const snapshot =
    await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error(
      "Notification tidak ditemukan."
    );
  }

  const data =
    snapshot.data();

  if (
    data.recipientUid !==
    currentUid
  ) {
    throw new Error(
      "Tidak memiliki akses ke notification ini."
    );
  }

  await updateDoc(
    ref,
    {
      status:
        NOTIFICATION_STATUS.READ,

      readAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp()
    }
  );

  return true;
}
