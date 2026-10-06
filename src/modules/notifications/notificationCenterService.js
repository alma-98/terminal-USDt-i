import {
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

export async function getNotificationInbox(
  superAdminUid,
  options = {}
) {
  if (!superAdminUid) {
    throw new Error(
      "Super Admin UID wajib tersedia."
    );
  }

  const pageSize =
    Number(options.limit ?? 50);

  const q =
    query(
      collection(
        db,
        COLLECTIONS.NOTIFICATIONS
      ),

      where(
        "recipientUid",
        "==",
        superAdminUid
      ),

      orderBy(
        "createdAt",
        "desc"
      ),

      limit(pageSize)
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

export async function getUnreadNotificationCount(
  superAdminUid
) {
  if (!superAdminUid) {
    throw new Error(
      "Super Admin UID wajib tersedia."
    );
  }

  const q =
    query(
      collection(
        db,
        COLLECTIONS.NOTIFICATIONS
      ),

      where(
        "recipientUid",
        "==",
        superAdminUid
      ),

      where(
        "status",
        "==",
        "unread"
      )
    );

  const snapshot =
    await getDocs(q);

  return snapshot.size;
}

export async function markNotificationAsRead(
  notificationId,
  superAdminUid
) {
  if (!notificationId) {
    throw new Error(
      "Notification ID wajib tersedia."
    );
  }

  if (!superAdminUid) {
    throw new Error(
      "Super Admin UID wajib tersedia."
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

  const notification =
    snapshot.data();

  if (
    notification.recipientUid !==
    superAdminUid
  ) {
    throw new Error(
      "Notification bukan milik Super Admin ini."
    );
  }

  await updateDoc(
    ref,
    {
      status:
        "read",

      readAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp()
    }
  );

  return true;
}

export async function getNotificationResource(
  notification
) {
  if (!notification) {
    throw new Error(
      "Notification tidak valid."
    );
  }

  if (
    notification.transactionId
  ) {
    const ref =
      doc(
        db,
        COLLECTIONS.TRANSACTIONS,
        notification.transactionId
      );

    const snapshot =
      await getDoc(ref);

    return {
      type:
        "transaction",

      id:
        notification.transactionId,

      exists:
        snapshot.exists(),

      data:
        snapshot.exists()
          ? {
              id:
                snapshot.id,

              ...snapshot.data()
            }
          : null
    };
  }

  if (
    notification.transferId
  ) {
    const ref =
      doc(
        db,
        COLLECTIONS.TRANSFERS,
        notification.transferId
      );

    const snapshot =
      await getDoc(ref);

    return {
      type:
        "transfer",

      id:
        notification.transferId,

      exists:
        snapshot.exists(),

      data:
        snapshot.exists()
          ? {
              id:
                snapshot.id,

              ...snapshot.data()
            }
          : null
    };
  }

  if (
    notification.resourceId &&
    notification.resourceType ===
      "audit"
  ) {
    const ref =
      doc(
        db,
        COLLECTIONS.AUDIT_LOGS,
        notification.resourceId
      );

    const snapshot =
      await getDoc(ref);

    return {
      type:
        "audit",

      id:
        notification.resourceId,

      exists:
        snapshot.exists(),

      data:
        snapshot.exists()
          ? {
              id:
                snapshot.id,

              ...snapshot.data()
            }
          : null
    };
  }

  return {
    type:
      null,

    id:
      null,

    exists:
      false,

    data:
      null
  };
}
