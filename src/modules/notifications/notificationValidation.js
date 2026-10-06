import {
  NOTIFICATION_EVENTS,
  NOTIFICATION_TYPES
} from "./notificationEvents.js";

const ALLOWED_EVENTS =
  Object.values(
    NOTIFICATION_EVENTS
  );

const ALLOWED_TYPES =
  Object.values(
    NOTIFICATION_TYPES
  );

export function validateNotificationInput(
  data
) {
  if (!data || typeof data !== "object") {
    throw new Error(
      "Notification data tidak valid."
    );
  }

  if (!data.recipientUid) {
    throw new Error(
      "recipientUid wajib diisi."
    );
  }

  if (!data.actorUid) {
    throw new Error(
      "actorUid wajib diisi."
    );
  }

  if (
    !ALLOWED_EVENTS.includes(
      data.eventType
    )
  ) {
    throw new Error(
      "eventType notification tidak valid."
    );
  }

  if (
    !ALLOWED_TYPES.includes(
      data.type
    )
  ) {
    throw new Error(
      "notification type tidak valid."
    );
  }

  if (!data.title) {
    throw new Error(
      "Notification title wajib diisi."
    );
  }

  if (!data.message) {
    throw new Error(
      "Notification message wajib diisi."
    );
  }

  return true;
}
