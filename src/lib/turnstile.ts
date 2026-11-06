import "server-only";

/* Cloudflare Turnstile server-side verification. Dormant until
   TURNSTILE_SECRET_KEY is set, so forms keep working before you add keys. */

const SECRET = process.env.TURNSTILE_SECRET_KEY;
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/* Only enforce when BOTH keys are configured. If just the secret is set (no
   public site key), the widget can't render, so enforcing would reject every
   submission — so we treat that as "off" instead of silently breaking forms. */
export const turnstileEnabled = Boolean(SECRET && SITE_KEY);

/**
 * Verify a Turnstile token. Returns true when it passes, or when Turnstile is
 * not configured (skip). Fails closed (false) only when enabled and the token
 * is missing or rejected.
 */
export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  if (!turnstileEnabled) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: SECRET as string, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
