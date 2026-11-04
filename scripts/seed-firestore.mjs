// One-off: upload the repo's content/*.json into Firestore so the live site
// starts from your current content. Safe to re-run (it overwrites each doc).
//
// Usage (Node 20.6+):
//   node --env-file=.env.local scripts/seed-firestore.mjs
//
// Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
// in the environment (same values you put in Vercel).

import { promises as fs } from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY.\n" +
      "Run with: node --env-file=.env.local scripts/seed-firestore.mjs",
  );
  process.exit(1);
}

const app =
  getApps()[0] ?? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore(app);

const CONTENT_DIR = path.join(process.cwd(), "content");
const COLLECTION = "site_content";

const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.log("No content/*.json files found — nothing to seed.");
  process.exit(0);
}

for (const file of files) {
  const name = path.basename(file, ".json");
  const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
  // Validate it is JSON, then store the normalised string.
  const value = JSON.stringify(JSON.parse(raw));
  await db
    .collection(COLLECTION)
    .doc(name)
    .set({ value, updatedAt: new Date().toISOString() });
  console.log(`seeded site_content/${name}`);
}

console.log(`\nDone — ${files.length} document(s) written to "${COLLECTION}".`);
process.exit(0);
