import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import { auth, db } from "../config/firebase.js";
import { normalizeUserRole } from "./rolePolicy.js";

import {
  doc,
  getDoc
} from "firebase/firestore";

const USER_EMAIL_MAP = {
  alma_coin: "alma_coin@terminal-usdt.local",
  admin: "admin@terminal-usdt.local"
};

export async function login(username, password) {
  const normalizedUsername = String(username || "").trim().toLowerCase();

  const email = USER_EMAIL_MAP[normalizedUsername];

  if (!email) {
    throw new Error("User atau password salah.");
  }

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = credential.user;

    const roleRef = doc(db, "users", user.uid);
    const roleSnapshot = await getDoc(roleRef);

    if (!roleSnapshot.exists()) {
      await signOut(auth);
      throw new Error("Role pengguna belum dikonfigurasi.");
    }

    const data = roleSnapshot.data();

    if (!["super_admin", "admin"].includes(data.role)) {
      await signOut(auth);
      throw new Error("Role pengguna tidak valid.");
    }

    return normalizeUserRole({
      uid: user.uid,
      email: user.email,
      role: data.role,
      permissions: data.permissions || [],
      displayName: data.displayName || ""
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    if (error?.code === "auth/invalid-credential" ||
        error?.code === "auth/wrong-password" ||
        error?.code === "auth/user-not-found" ||
        error?.code === "auth/invalid-email") {
      throw new Error("User atau password salah.");
    }

    throw error;
  }
}

export async function logout() {
  await signOut(auth);
}

export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function getCurrentUserRole(uid) {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}
