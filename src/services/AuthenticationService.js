import {
  signInWithPopup, signOut as fbSignOut, onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { auth, googleProvider } from './firebaseConfig.js';
import { dataStore } from './dataStore.js';

const SESSION_KEY = 'cctms_admin_session';

/**
 * AuthenticationService — FR-001..005, PART 12 §6 Authentication Flow.
 * Real Google Sign-In + Firestore `admins` lookup + RBAC check (FR-003).
 * Non-admin Google accounts are signed back out immediately (403).
 */
export const AuthenticationService = {
  /** Opens the Google popup, then verifies the caller is a registered admin.
   *  Checks admins/{uid} first (matches firestore.rules), falling back to
   *  an email-based lookup for accounts not yet migrated to that scheme. */
  async signInWithGoogle() {
    const { user } = await signInWithPopup(auth, googleProvider);

    let admin = await dataStore.get('admins', user.uid);
    if (!admin) {
      const byEmail = await dataStore.list('admins', { email: user.email });
      admin = byEmail[0] || null;
    }

    if (!admin || admin.status !== 'Active') {
      await fbSignOut(auth);
      throw new Error('403 Forbidden — บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานระบบ Admin');
    }

    const role = await dataStore.get('roles', admin.roleId);
    const session = {
      adminId: admin.id, displayName: admin.displayName || user.displayName,
      email: admin.email, roleId: admin.roleId, roleName: role?.name,
      photoURL: user.photoURL, loginAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    await dataStore.update('admins', admin.id, { lastLogin: session.loginAt });
    await dataStore.logActivity({ adminId: admin.id, action: 'Login', targetType: 'Admin', targetId: admin.id, description: `${admin.displayName} เข้าสู่ระบบ` });
    return session;
  },

  async signOut() {
    const session = this.currentSession();
    if (session) {
      await dataStore.logActivity({ adminId: session.adminId, action: 'Login', targetType: 'Admin', targetId: session.adminId, description: `${session.displayName} ออกจากระบบ` });
    }
    localStorage.removeItem(SESSION_KEY);
    await fbSignOut(auth);
  },

  currentSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  isAuthenticated() {
    return !!this.currentSession();
  },

  /** Route Guard helper (PART 11 §10) — call at the top of every /admin page. */
  requireAuth(redirectTo = 'index.html') {
    const session = this.currentSession();
    if (!session) {
      window.location.href = redirectTo;
      return null;
    }
    return session;
  },

  hasRole(...roleNames) {
    const session = this.currentSession();
    return !!session && roleNames.includes(session.roleName);
  },

  /** Keeps the local session in sync if the Firebase auth state changes
   *  elsewhere (e.g. token expiry, sign-out in another tab). Call once
   *  at app startup if you want that behavior; optional. */
  onAuthChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      if (!user) localStorage.removeItem(SESSION_KEY);
      callback(user, this.currentSession());
    });
  },

  async listAdmins() {
    return dataStore.list('admins');
  },
};
