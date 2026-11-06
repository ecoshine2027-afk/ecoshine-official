"use server";

import { revalidatePath } from "next/cache";
import { readContent, writeContent } from "@/lib/content-store";
import { services, states } from "@/lib/site";
import { isEmail, isAuPhone, required, maxLen, validateAll } from "@/lib/validate";
import { notifyNewEnquiry } from "@/lib/email";
import type { Submission } from "@/lib/content";
import { type SubmitState, HONEYPOT_FIELD } from "@/lib/forms";

/* Public, unauthenticated form handlers for the contact page and the quote
   modal. Both persist to content/submissions.json so the admin "Enquiries"
   screen can read them. Kept separate from the admin actions on purpose: these
   must NOT require an admin session. */

const MAX_STORED = 500; // keep the JSON store from growing without bound

function field(formData: FormData, name: string): string {
  const v = formData.get(name);
  return typeof v === "string" ? v.trim() : "";
}

async function saveSubmission(sub: Submission): Promise<void> {
  const { items } = await readContent<{ items: Submission[] }>("submissions", { items: [] });
  const next = [sub, ...items].slice(0, MAX_STORED);
  await writeContent("submissions", { items: next });
  // Refresh the admin enquiries view / dashboard counter.
  revalidatePath("/ecoshine_admin_panel", "layout");
  // Best-effort email notification (no-op unless configured); never throws.
  await notifyNewEnquiry(sub);
}

function makeId(): string {
  return `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function submitContactAction(
  _prev: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  // Honeypot: a bot filled the hidden field — pretend success and drop it.
  if (field(formData, HONEYPOT_FIELD)) return { ok: true };

  const name = field(formData, "name");
  const email = field(formData, "email");
  const phone = field(formData, "phone");
  const subject = field(formData, "subject");
  const message = field(formData, "message");

  const err = validateAll(
    required(name, "Name"),
    maxLen(name, 100, "Name"),
    required(email, "Email"),
    isEmail(email, "Email"),
    isAuPhone(phone, "Phone"),
    required(message, "Message"),
    maxLen(message, 3000, "Message")
  );
  if (err) return { ok: false, error: err };

  await saveSubmission({
    id: makeId(),
    kind: "contact",
    createdAt: new Date().toISOString(),
    read: false,
    name,
    email,
    phone,
    subject: subject || "General enquiry",
    message,
    meta: {},
  });

  return { ok: true };
}

export async function submitQuoteAction(
  _prev: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  // Honeypot: a bot filled the hidden field — pretend success and drop it.
  if (field(formData, HONEYPOT_FIELD)) return { ok: true };

  const name = field(formData, "name");
  const email = field(formData, "email");
  const phone = field(formData, "phone");
  const company = field(formData, "company");
  const stateCode = field(formData, "state");
  const suburb = field(formData, "suburb");
  const serviceSlug = field(formData, "service");
  const message = field(formData, "message");

  const err = validateAll(
    required(name, "Name"),
    maxLen(name, 100, "Name"),
    required(email, "Email"),
    isEmail(email, "Email"),
    required(phone, "Phone"),
    isAuPhone(phone, "Phone"),
    required(stateCode, "State"),
    required(serviceSlug, "Service"),
    maxLen(message, 3000, "Message")
  );
  if (err) return { ok: false, error: err };

  const serviceName = services.find((s) => s.slug === serviceSlug)?.title ?? serviceSlug;
  const stateName = states.find((s) => s.code === stateCode)?.name ?? stateCode;

  await saveSubmission({
    id: makeId(),
    kind: "quote",
    createdAt: new Date().toISOString(),
    read: false,
    name,
    email,
    phone,
    subject: serviceName,
    message,
    meta: {
      ...(company ? { company } : {}),
      state: stateName,
      ...(suburb ? { suburb } : {}),
    },
  });

  return { ok: true };
}
