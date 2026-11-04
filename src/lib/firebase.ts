import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/* Firebase Admin (server-side only). Configured entirely from environment
   variables so the service-account key never lives in the repo. When the env
   vars are absent (e.g. local dev without Firebase), `firebaseEnabled` is false
   and the content store falls back to the local filesystem. */

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Vercel stores multi-line secrets with literal "\n"; restore real newlines.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

export const firebaseEnabled = Boolean(projectId && clientEmail && privateKey);

/** Image uploads use Firebase Storage only once a bucket is configured. Until
    then (on Vercel) uploads are refused so nothing is written to the read-only
    disk; set FIREBASE_STORAGE_BUCKET later to switch them on — no code change. */
export const storageEnabled = firebaseEnabled && Boolean(storageBucket);

let app: App | undefined;

function getApp(): App {
  if (!firebaseEnabled) {
    throw new Error("Firebase is not configured (missing FIREBASE_* env vars).");
  }
  if (!app) {
    app =
      getApps()[0] ??
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        storageBucket,
      });
  }
  return app;
}

export function getDb(): Firestore {
  return getFirestore(getApp());
}

export function getBucket() {
  return getStorage(getApp()).bucket();
}
