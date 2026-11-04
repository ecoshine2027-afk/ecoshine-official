import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { firebaseEnabled, getDb } from "@/lib/firebase";

/* Admin-editable content store. When Firebase is configured, content lives in
   the Firestore `site_content` collection (one doc per name, JSON in a `value`
   field) — required for serverless hosts like Vercel with a read-only disk.
   Otherwise it falls back to JSON files in <repo>/content for local dev or a
   VPS with a writable disk. A missing entry means "no overrides yet". */

const CONTENT_DIR = path.join(process.cwd(), "content");
const COLLECTION = "site_content";

export async function readContent<T>(name: string, fallback: T): Promise<T> {
  if (firebaseEnabled) {
    try {
      const snap = await getDb().collection(COLLECTION).doc(name).get();
      const raw = snap.exists ? snap.data()?.value : undefined;
      return typeof raw === "string" ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }
  try {
    const raw = await fs.readFile(path.join(CONTENT_DIR, `${name}.json`), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeContent<T>(name: string, data: T): Promise<void> {
  if (firebaseEnabled) {
    await getDb()
      .collection(COLLECTION)
      .doc(name)
      .set({ value: JSON.stringify(data), updatedAt: new Date().toISOString() });
    return;
  }
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  const file = path.join(CONTENT_DIR, `${name}.json`);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, file);
}
