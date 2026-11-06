import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { firebaseEnabled, storageEnabled } from "@/lib/firebase";
import { readContent, writeContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

/* Admin-only diagnostic: confirms whether Firebase is actually configured on
   the running server and does a live Firestore read/write round-trip. Does not
   expose any secret values — only whether each env var is present. */
export async function GET() {
  await requireAdmin(); // logged-out visitors are redirected to the login page

  const out: Record<string, unknown> = {
    firebaseEnabled,
    storageEnabled,
    envPresent: {
      FIREBASE_PROJECT_ID: Boolean(process.env.FIREBASE_PROJECT_ID),
      FIREBASE_CLIENT_EMAIL: Boolean(process.env.FIREBASE_CLIENT_EMAIL),
      FIREBASE_PRIVATE_KEY: Boolean(process.env.FIREBASE_PRIVATE_KEY),
      FIREBASE_STORAGE_BUCKET: Boolean(process.env.FIREBASE_STORAGE_BUCKET),
    },
  };

  try {
    await writeContent("_health", { ts: new Date().toISOString() });
    const back = await readContent<{ ts?: string }>("_health", {});
    out.firestoreRoundTrip = back.ts ? "ok" : "read-empty";
  } catch (e) {
    out.firestoreRoundTrip = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  try {
    const subs = await readContent<{ items: unknown[] }>("submissions", { items: [] });
    out.submissionsCount = Array.isArray(subs.items) ? subs.items.length : 0;
  } catch (e) {
    out.submissionsCount = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(out);
}
