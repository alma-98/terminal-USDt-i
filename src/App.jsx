import { useEffect, useState } from "react";

import Login from "./pages/Login.jsx";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

import {
  logout,
  watchAuth,
  getCurrentUserRole
} from "./auth/authService.js";

import { normalizeUserRole } from "./auth/rolePolicy.js";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = watchAuth(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await getCurrentUserRole(firebaseUser.uid);

        if (!profile) {
          await logout();
          setUser(null);
        } else {
          setUser(
            normalizeUserRole({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: profile.role,
              permissions: profile.permissions || [],
              displayName: profile.displayName || ""
            })
          );
        }
      } catch {
        await logout();
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <main className="loading-screen">
        Memuat Terminal-USDt...
      </main>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  if (user.role === "super_admin") {
    return (
      <SuperAdminDashboard
        user={user}
        onLogout={logout}
      />
    );
  }

  if (user.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        onLogout={logout}
      />
    );
  }

  return (
    <main className="loading-screen">
      Role tidak dikenali.
    </main>
  );
}
