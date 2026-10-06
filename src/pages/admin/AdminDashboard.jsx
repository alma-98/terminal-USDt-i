import { useState } from "react";
import AdminMenu from "../../components/dashboard/AdminMenu.jsx";
import {
  hasPermission
} from "../../auth/permissionMatrix.js";

export default function AdminDashboard({
  user,
  onLogout
}) {
  const [active, setActive] = useState("Dashboard");

  const can = (module, action) =>
    hasPermission(user.role, module, action);

  return (
    <main className="role-dashboard">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <strong>Terminal-USDt</strong>
          <span>Control Center</span>
        </div>

        <div className="role-badge admin">
          ADMIN
        </div>

        <AdminMenu
          user={user}
          active={active}
          onSelect={setActive}
        />
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-topbar">
          <div>
            <span className="eyebrow">
              ADMIN
            </span>

            <h1>{active}</h1>

            <p>{user.email}</p>
          </div>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>
        </header>

        <section className="dashboard-overview">
          <article className="dashboard-card primary">
            <span>Role</span>
            <strong>Admin</strong>
            <small>Permission based access</small>
          </article>

          <article className="dashboard-card">
            <span>Transfer</span>
            <strong>
              {can("transfer", "create")
                ? "Available"
                : "Restricted"}
            </strong>
          </article>

          <article className="dashboard-card">
            <span>Destination Wallet</span>
            <strong>
              {can("destination_wallet", "read")
                ? "Available"
                : "Restricted"}
            </strong>
          </article>

          <article className="dashboard-card">
            <span>Swap</span>
            <strong>
              {can("swap", "create")
                ? "Available"
                : "Restricted"}
            </strong>
          </article>

          <article className="dashboard-card">
            <span>Burn Request</span>
            <strong>
              {can("burn", "create")
                ? "Available"
                : "Restricted"}
            </strong>
          </article>

          <article className="dashboard-card">
            <span>Refill</span>
            <strong className="denied">
              Not Available
            </strong>
          </article>
        </section>

        <section className="dashboard-panel">
          <h2>{active}</h2>

          <p>
            Fungsi yang tampil di dashboard mengikuti
            permission Admin.
          </p>

          {active === "Dashboard" && (
            <div className="info-box">
              Admin Control Center.
            </div>
          )}

          {active === "Transfer" && (
            <div className="info-box">
              Admin dapat melakukan transfer dengan
              tenor sesuai hak akses.
            </div>
          )}

          {active === "Burn Request" && (
            <div className="info-box">
              Admin dapat membuat Burn Request.
              Burn Approval bukan hak Admin.
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
