/**
 * dataStore.js — FIREBASE FIRESTORE VERSION
 * ----------------------------------------------------------------
 * Same public API as the mock version (list/get/add/update/subscribe/...),
 * now backed by real Cloud Firestore. Every method is now ASYNC (except
 * `subscribe`, which is realtime by nature and returns an unsubscribe fn).
 *
 * Because these are now async, every Service in /src/services/*.js that
 * calls dataStore must itself become `async` and use `await` — and every
 * page that calls a Service method must `await` it too. This file is the
 * only one with Firestore-specific code; the rest is mechanical.
 * ----------------------------------------------------------------
 */

import {
  collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc,
  query, where, onSnapshot, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { db } from './firebaseConfig.js';
import { generateId } from '../utils/helpers.js';
import { Visibility } from '../utils/enums.js';

function buildQuery(collectionName, filters = {}) {
  const col = collection(db, collectionName);
  const constraints = Object.entries(filters)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => (Array.isArray(v) ? where(k, 'in', v) : where(k, '==', v)));
  return constraints.length ? query(col, ...constraints) : col;
}

function snapshotToRows(snap) {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export const dataStore = {
  /** Re-seeding a live Firestore project isn't done from the client — use
   *  a one-off admin script or the Firebase Console / Import-Export tools. */
  async resetToSeed() {
    throw new Error('resetToSeed() is not available in Firebase mode. Seed data via a script using the Admin SDK instead.');
  },

  async list(collectionName, filters = {}) {
    const snap = await getDocs(buildQuery(collectionName, filters));
    return snapshotToRows(snap);
  },

  async get(collectionName, id) {
    const snap = await getDoc(doc(db, collectionName, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getBySlug(collectionName, slug) {
    const snap = await getDocs(query(collection(db, collectionName), where('slug', '==', slug)));
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  /** Uses a client-generated id (same scheme as the mock store) via setDoc,
   *  so ids look like "team_x7f2a" instead of Firestore's random push id.
   *  Swap to plain addDoc(collection(...), data) if you prefer auto ids. */
  async add(collectionName, data, prefix) {
    const id = data.id || generateId(prefix || collectionName.slice(0, 4));
    const record = { ...data, id };
    await setDoc(doc(db, collectionName, id), record);
    return record;
  },

  async update(collectionName, id, patch) {
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, patch);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  /** Soft delete per PART 4 §13 — never hard-delete, move to Hidden/Archived. */
  async softDelete(collectionName, id, by = 'system') {
    return this.update(collectionName, id, { visibility: Visibility.HIDDEN, updatedBy: by, updatedAt: new Date().toISOString() });
  },

  async restore(collectionName, id, by = 'system') {
    return this.update(collectionName, id, { visibility: Visibility.PUBLIC, updatedBy: by, updatedAt: new Date().toISOString() });
  },

  /**
   * Realtime subscription — real onSnapshot this time.
   * Same signature as the mock version: subscribe(name, filters, cb) => unsubscribeFn
   */
  subscribe(collectionName, filters, callback) {
    const q = buildQuery(collectionName, filters);
    return onSnapshot(q, (snap) => callback(snapshotToRows(snap)), (err) => console.error(`onSnapshot(${collectionName}) error:`, err));
  },

  async logActivity(entry) {
    return this.add('activityLogs', { ...entry, createdAt: new Date().toISOString() }, 'log');
  },

  async logAudit(entry) {
    return this.add('auditLogs', { ...entry, createdAt: new Date().toISOString() }, 'audit');
  },
};
