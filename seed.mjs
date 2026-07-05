/**
 * seed.mjs — one-time bootstrap script using the Firebase Admin SDK.
 * Run this ONCE after creating your Firestore database, to create the
 * `roles` collection and your first Super Admin account (so someone can
 * actually log in to /admin for the first time).
 *
 * Setup:
 *   1. npm install firebase-admin
 *   2. Firebase Console → Project Settings → Service Accounts →
 *      "Generate new private key" → save as serviceAccountKey.json
 *      (keep this file OUT of git / hosting — it's a secret)
 *   3. Edit SUPER_ADMIN_EMAIL / SUPER_ADMIN_NAME below
 *   4. node seed.mjs
 *
 * IMPORTANT: after this admin signs in with Google for the first time,
 * open Firebase Console → Authentication, copy their UID, then rename
 * the created admins/{docId} document's ID to that UID (Firestore
 * doesn't support renaming directly — copy the fields into a new
 * document at admins/{uid} and delete the old one). This matches the
 * schema assumed by firestore.rules. See firestore.rules header comment.
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const SUPER_ADMIN_EMAIL = 'principal.admin@yourschool.ac.th'; // TODO: your real Google account email
const SUPER_ADMIN_NAME = 'ผู้ดูแลระบบหลัก';

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf-8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function seed() {
  const roles = [
    { id: 'role_super', name: 'Super Admin', description: 'สิทธิ์สูงสุด จัดการได้ทุกส่วนของระบบ' },
    { id: 'role_tadmin', name: 'Tournament Admin', description: 'จัดการการแข่งขัน ทีม ผู้เล่น ตารางแข่งขัน' },
    { id: 'role_recorder', name: 'Recorder', description: 'บันทึกการเดินหมากและผลการแข่งขันหน้างาน' },
    { id: 'role_judge', name: 'Judge', description: 'อนุมัติผลการแข่งขันและ Override กติกา' },
  ];
  for (const r of roles) {
    await db.collection('roles').doc(r.id).set(r);
    console.log(`✓ role: ${r.name}`);
  }

  const adminRef = await db.collection('admins').add({
    email: SUPER_ADMIN_EMAIL,
    displayName: SUPER_ADMIN_NAME,
    roleId: 'role_super',
    status: 'Active',
    photoURL: '',
    lastLogin: null,
  });
  console.log(`✓ super admin created: ${adminRef.id}`);
  console.log('\nNEXT STEP: sign in with this Google account in /admin once, then move');
  console.log(`this document to admins/{their-auth-uid} so firestore.rules can find it.`);
}

seed().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
