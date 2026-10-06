import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getNotificationInbox,
  getUnreadNotificationCount,
  markNotificationAsRead,
  getNotificationResource
} from "../../modules/notifications/notificationCenterService.js";

const FILTERS = [
  {
    value:
      "all",
    label:
      "Semua"
  },

  {
    value:
      "unread",
    label:
      "Belum Dibaca"
  },

  {
    value:
      "transaction",
    label:
      "Transaction"
  },

  {
    value:
      "audit",
    label:
      "Audit"
  }
];

export default function NotificationCenter({
  user
}) {
  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    selected,
    setSelected
  ] = useState(null);

  const [
    resource,
    setResource
  ] = useState(null);

  const [
    filter,
    setFilter
  ] = useState("all");

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  async function load() {
    try {
      setError("");

      if (
        !user?.uid ||
        user?.role !==
          "super_admin"
      ) {
        throw new Error(
          "Notification Center hanya dapat diakses Super Admin."
        );
      }

      const data =
        await getNotificationInbox(
          user.uid
        );

      setNotifications(
        data
      );
    } catch (err) {
      setError(
        err?.message ||
        "Gagal memuat notification."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [user?.uid]);

  const unreadCount =
    useMemo(
      () =>
        notifications.filter(
          (item) =>
            item.status ===
            "unread"
        ).length,
      [notifications]
    );

  const filtered =
    useMemo(() => {
      if (
        filter ===
        "unread"
      ) {
        return notifications.filter(
          (item) =>
            item.status ===
            "unread"
        );
      }

      if (
        filter ===
        "transaction"
      ) {
        return notifications.filter(
          (item) =>
            item.type ===
              "transaction" ||
            item.eventType?.includes(
              "transaction"
            ) ||
            item.eventType?.includes(
              "transfer"
            ) ||
            item.eventType?.includes(
              "swap"
            ) ||
            item.eventType?.includes(
              "burn"
            )
        );
      }

      if (
        filter ===
        "audit"
      ) {
        return notifications.filter(
          (item) =>
            item.type ===
              "audit" ||
            item.eventType?.includes(
              "hash_edit"
            )
        );
      }

      return notifications;
    }, [
      notifications,
      filter
    ]);

  async function openNotification(
    notification
  ) {
    try {
      setSelected(
        notification
      );

      setResource(null);

      if (
        notification.status ===
        "unread"
      ) {
        await markNotificationAsRead(
          notification.id,
          user.uid
        );

        setNotifications(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                notification.id
                  ? {
                      ...item,
                      status:
                        "read"
                    }
                  : item
            )
        );
      }

      const result =
        await getNotificationResource(
          notification
        );

      setResource(
        result
      );
    } catch (err) {
      setError(
        err?.message ||
        "Gagal membuka notification."
      );
    }
  }

  return (
    <section className="dashboard-panel">

      <div
        className="tenor-header"
      >
        <div>
          <span className="eyebrow">
            SUPER ADMIN
          </span>

          <h2>
            Notification Center
          </h2>

          <p>
            Notifikasi aktivitas
            penting dari Admin.
          </p>
        </div>

        <div>
          <strong>
            {unreadCount}
          </strong>

          <span>
            {" "}
            belum dibaca
          </span>
        </div>
      </div>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <div
        style={{
          display:
            "flex",
          gap:
            "8px",
          flexWrap:
            "wrap",
          marginBottom:
            "18px"
        }}
      >
        {FILTERS.map(
          (item) => (
            <button
              key={
                item.value
              }
              type="button"
              className={
                filter ===
                item.value
                  ? "primary-button"
                  : "secondary-button"
              }
              onClick={() =>
                setFilter(
                  item.value
                )
              }
            >
              {item.label}
            </button>
          )
        )}

        <button
          type="button"
          className="secondary-button"
          onClick={load}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p>
          Memuat notification...
        </p>
      ) : filtered.length ===
        0 ? (
        <div className="dashboard-panel">
          <h3>
            Inbox kosong
          </h3>

          <p>
            Tidak ada notification
            untuk filter ini.
          </p>
        </div>
      ) : (
        <div
          style={{
            display:
              "grid",
            gap:
              "10px"
          }}
        >
          {filtered.map(
            (item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  openNotification(
                    item
                  )
                }
                style={{
                  textAlign:
                    "left",
                  cursor:
                    "pointer",
                  padding:
                    "16px",
                  borderRadius:
                    "12px",
                  border:
                    "1px solid var(--border, #ddd)",
                  background:
                    item.status ===
                    "unread"
                      ? "var(--panel, #f5f7fa)"
                      : "transparent"
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
                    {item.status ===
                    "unread"
                      ? "UNREAD"
                      : "READ"}
                  </strong>
                </div>

                {item.transactionId && (
                  <small>
                    Transaction:
                    {" "}
                    {item.transactionId}
                  </small>
                )}

                {item.transferId && (
                  <small>
                    Transfer:
                    {" "}
                    {item.transferId}
                  </small>
                )}
              </button>
            )
          )}
        </div>
      )}

      {selected && (
        <div
          className="dashboard-panel"
          style={{
            marginTop:
              "20px"
          }}
        >
          <span className="eyebrow">
            NOTIFICATION DETAIL
          </span>

          <h3>
            {selected.title}
          </h3>

          <p>
            {selected.message}
          </p>

          <p>
            Event:
            {" "}
            <strong>
              {selected.eventType}
            </strong>
          </p>

          <p>
            Actor:
            {" "}
            <strong>
              {selected.actorUid}
            </strong>
          </p>

          <p>
            Role:
            {" "}
            <strong>
              {selected.actorRole}
            </strong>
          </p>

          {selected.transactionId && (
            <p>
              Transaction ID:
              {" "}
              <strong>
                {selected.transactionId}
              </strong>
            </p>
          )}

          {selected.transferId && (
            <p>
              Transfer ID:
              {" "}
              <strong>
                {selected.transferId}
              </strong>
            </p>
          )}

          {resource?.exists && (
            <div
              className="dashboard-panel"
            >
              <span className="eyebrow">
                LINKED RESOURCE
              </span>

              <h4>
                {resource.type}
              </h4>

              <p>
                Resource ID:
                {" "}
                {resource.id}
              </p>

              {resource.data?.txHash && (
                <p>
                  TX Hash:
                  {" "}
                  {resource.data.txHash}
                </p>
              )}

              {resource.data?.status && (
                <p>
                  Status:
                  {" "}
                  {resource.data.status}
                </p>
              )}

              {resource.data?.etherscanUrl && (
                <p>
                  <a
                    href={
                      resource.data
                        .etherscanUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lihat transaksi di Explorer
                  </a>
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setSelected(null);
              setResource(null);
            }}
          >
            Tutup Detail
          </button>
        </div>
      )}

    </section>
  );
}
