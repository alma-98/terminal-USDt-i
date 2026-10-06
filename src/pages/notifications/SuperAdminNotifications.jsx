import {
  useEffect,
  useState
} from "react";

import {
  listSuperAdminNotifications,
  markNotificationRead
} from "../../modules/notifications/notificationService.js";

export default function SuperAdminNotifications({
  user
}) {
  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  async function loadNotifications() {
    try {
      setError("");

      if (
        !user?.uid ||
        user?.role !==
          "super_admin"
      ) {
        throw new Error(
          "Halaman ini hanya untuk Super Admin."
        );
      }

      const data =
        await listSuperAdminNotifications(
          user.uid
        );

      setNotifications(
        data
      );
    } catch (err) {
      setError(
        err?.message ||
        "Gagal mengambil notification."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [user?.uid]);

  async function markRead(
    notificationId
  ) {
    try {
      await markNotificationRead(
        notificationId,
        user.uid
      );

      await loadNotifications();
    } catch (err) {
      setError(
        err?.message ||
        "Gagal memperbarui notification."
      );
    }
  }

  const unreadCount =
    notifications.filter(
      (item) =>
        item.status ===
        "unread"
    ).length;

  return (
    <section className="dashboard-panel">

      <div className="tenor-header">
        <div>
          <span className="eyebrow">
            SUPER ADMIN
          </span>

          <h2>
            Transaction Notifications
          </h2>
        </div>

        <strong>
          {unreadCount} unread
        </strong>
      </div>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {loading ? (
        <p>
          Memuat notification...
        </p>
      ) : notifications.length === 0 ? (
        <p>
          Belum ada notification.
        </p>
      ) : (
        <div>
          {notifications.map(
            (item) => (
              <article
                key={item.id}
                className="dashboard-panel"
                style={{
                  marginBottom:
                    "12px"
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    gap:
                      "12px"
                  }}
                >
                  <div>
                    <span className="eyebrow">
                      {item.eventType}
                    </span>

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.message}
                    </p>
                  </div>

                  <strong>
                    {item.status}
                  </strong>
                </div>

                {item.actorUid && (
                  <p>
                    Actor:
                    {" "}
                    {item.actorUid}
                  </p>
                )}

                {item.transactionId && (
                  <p>
                    Transaction:
                    {" "}
                    {item.transactionId}
                  </p>
                )}

                {item.transferId && (
                  <p>
                    Transfer:
                    {" "}
                    {item.transferId}
                  </p>
                )}

                {item.status ===
                  "unread" && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      markRead(
                        item.id
                      )
                    }
                  >
                    Tandai Dibaca
                  </button>
                )}
              </article>
            )
          )}
        </div>
      )}

    </section>
  );
}
