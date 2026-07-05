# CCTMS — Firebase Edition

This is the **fully Firebase-integrated** version of CCTMS: real Firestore, real Google
Auth, real Cloud Storage, and ready for Firebase Hosting. Every page and Service in
this folder has already been converted to `async/await` against the real Firebase SDK
(CDN ES Modules — no build step needed).

---

## 0. What changed from the mock version

| File | Change |
|---|---|
| `src/services/firebaseConfig.js` | **New.** Firebase app/Firestore/Auth/Storage init — fill in your config. |
| `src/services/dataStore.js` | Rewritten against real Firestore (`getDocs`, `onSnapshot`, etc). All methods are now `async`. |
| `src/services/AuthenticationService.js` | Rewritten for real Google Sign-In (`signInWithPopup`) + Firestore admin lookup. |
| `src/services/StorageService.js` | Rewritten for real Cloud Storage uploads. |
| All other 13 Service files | Mechanically converted to `async`/`await` (same business logic, same method names). |
| All 29 HTML pages (`public/*`, `admin/*`) | Converted to `await` every Service call; render functions are now `async`. |
| `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `storage.rules` | **New.** Hosting + security rules, ready to deploy. |
| `seed.mjs` | **New.** One-time Admin SDK script to bootstrap roles + your first Super Admin. |

Nothing about the page structure, design, or business logic (PART 1–17 spec) changed —
only the data-access layer.

---

## 1. Firebase Console setup

1. Create a project at https://console.firebase.google.com
2. **Build → Authentication** → Sign-in method → enable **Google**
3. **Build → Firestore Database** → Create database (production mode)
4. **Build → Storage** → Get started (production mode)
5. Project Settings → General → "Your apps" → Add app → Web (`</>`) → copy the config object

Paste that config into `src/services/firebaseConfig.js`:
```js
const firebaseConfig = {
  apiKey: '...', authDomain: '...', projectId: '...',
  storageBucket: '...', messagingSenderId: '...', appId: '...',
};
```

## 2. Bootstrap your first admin (one-time, via Admin SDK)

```bash
npm install firebase-admin
```
- Project Settings → Service Accounts → "Generate new private key" → save as `serviceAccountKey.json` in this folder (never commit or deploy this file — it's a secret)
- Edit `SUPER_ADMIN_EMAIL` in `seed.mjs` to your real Google account email
- Run:
```bash
node seed.mjs
```
This creates the 4 roles (`Super Admin`, `Tournament Admin`, `Recorder`, `Judge`) and one Super Admin document.

**Important follow-up step:** sign in once at `/admin` with that Google account, then in
Firestore Console copy the new document's fields into `admins/{their-auth-uid}` (delete
the old auto-id doc). `firestore.rules` looks up `admins/{request.auth.uid}` directly for
performance, so the doc ID must equal the signed-in user's UID. `AuthenticationService`
already checks this location first and falls back to an email-based query, so login still
works before you do this — but rules enforcement (the security half) requires the doc ID
to match.

## 3. Install the Firebase CLI & deploy rules

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # choose your project, alias it "default"
firebase deploy --only firestore:rules,storage:rules
```

## 4. Deploy Hosting

```bash
firebase deploy --only hosting
```
`firebase.json` is already configured to serve this folder as static Hosting, with
`/` → `index.html` and `/admin` → `admin/index.html`. No build step — it deploys exactly
what you see in this folder.

## 5. Local development with emulators (recommended before going live)

```bash
firebase emulators:start
```
This runs Auth + Firestore + Storage + Hosting locally (ports listed in `firebase.json`).
Point `firebaseConfig.js` at the emulator during development by adding, right after
`initializeApp`:
```js
import { connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { connectAuthEmulator } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { connectStorageEmulator } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js';
connectFirestoreEmulator(db, 'localhost', 8080);
connectAuthEmulator(auth, 'http://localhost:9099');
connectStorageEmulator(storage, 'localhost', 9199);
```
(Wrap in `if (location.hostname === 'localhost')` so production doesn't try to connect to
an emulator that isn't running.)

## 6. Security Rules summary (`firestore.rules`)

Based on PART 7 of the spec:
- **Public collections** (events, tournaments, teams, players, news, gallery, hallOfFame, boards, matches, moves, results, statistics, rankings): anyone can **read** (this is what powers the public live site with no login) — only **Tournament Admin+** can write.
- **Results**: Recorder can `create` (submit for review); only **Judge+** can `update` (approve / amend).
- **admins / roles / permissions**: only active Admins can read; only **Super Admin** can write.
- **activityLogs / auditLogs**: append-only (no update/delete allowed by anyone, including Super Admin, at the rules level) — a genuine audit trail.

Composite indexes: `firestore.indexes.json` starts empty because every query in this app
uses equality filters only, which Firestore doesn't require a composite index for. If a
future query needs one, Firebase shows a Console error with a direct "create index" link.

## 7. Everyday use

Once deployed, share:
- Public site: `https://your-project.web.app/`
- Admin panel: `https://your-project.web.app/admin/`

Everything (scores, moves, results, rankings) updates live across every open browser tab
via Firestore's `onSnapshot` — across any device or network, in real time.
