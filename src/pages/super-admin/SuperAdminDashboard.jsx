import { useState } from "react";
import SuperAdminMenu from "../../components/dashboard/SuperAdminMenu.jsx";
import { hasPermission } from "../../auth/permissionMatrix.js";

export default function SuperAdminDashboard({
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

        <div className="role-badge super">
          SUPER ADMIN
        </div>

        <SuperAdminMenu
          user={user}
          active={active}
          onSelect={setActive}
        />
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-topbar">
          <div>
            <span className="eyebrow">
              SUPER ADMIN
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
            <strong>Super Admin</strong>
            <small>Full system control</small>
          </article>

          <article className="dashboard-card">
            <span>Coin</span>
            <strong>
              {can("coin", "read") ? "Available" : "Restricted"}
            </strong>
          </article>

          <article className="dashboard-card">
            <span>Refill</span>
            <strong>
              {can("refill", "create") ? "Available" : "Restricted"}
            </strong>
          </article>

          <article className="dashboard-card">
            <span>Burn Approval</span>
            <strong>
              {can("burn", "approve") ? "Available" : "Restricted"}
            </strong>
          </article>

          <article className="dashboard-card">
            <span>System Control</span>
            <strong>
              {can("system_settings", "update")
                ? "Available"
                : "Restricted"}
            </strong>
          </article>

          <article className="dashboard-card">
            <span>Audit</span>
            <strong>
              {can("audit", "read")
                ? "Available"
                : "Restricted"}
            </strong>
          </article>
        </section>

        <section className="dashboard-panel">
          <h2>{active}</h2>

          <p>
            Super Admin memiliki akses terhadap modul
            sistem sesuai permission policy.
          </p>

          {active === "Refill" && (
            <div className="info-box">
              Refill hanya tersedia untuk Super Admin.
            </div>
          )}

          {active === "Burn" && (
            <div className="info-box">
              Burn Approval nantinya membutuhkan
              re-authentication Super Admin.
            </div>
          )}

          {active === "Dashboard" && (
            <div className="info-box">
              Control Center Super Admin.
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
