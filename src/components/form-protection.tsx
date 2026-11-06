"use client";

import { useEffect, useRef, useState } from "react";
import { HONEYPOT_FIELD } from "@/lib/forms";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Cloudflare Turnstile widget. Renders nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY
    is set. The solved token is captured in the callback and written into a
    React-controlled hidden input (response-field disabled on Turnstile's side),
    so it is always submitted with the form — including inside the quote modal.
    This is what the server verifies via siteverify. */
export function TurnstileWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !ref.current || !window.turnstile || idRef.current) return;
      idRef.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        theme: "auto",
        "response-field": false, // we manage the hidden input ourselves
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };

    if (!document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile"]')) {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      render();
    }

    // The script may be present a moment before window.turnstile is ready.
    const poll = setInterval(render, 300);
    const stop = setTimeout(() => clearInterval(poll), 8000);

    return () => {
      cancelled = true;
      clearInterval(poll);
      clearTimeout(stop);
      if (idRef.current && window.turnstile) {
        try {
          window.turnstile.remove(idRef.current);
        } catch {
          /* already gone */
        }
      }
    };
  }, []);

  if (!SITE_KEY) return null;
  return (
    <div className="sm:col-span-2">
      <div ref={ref} />
      <input type="hidden" name="cf-turnstile-response" value={token} readOnly />
    </div>
  );
}

/** Off-screen honeypot. Real users never see or fill it; bots that auto-fill
    every field get silently dropped server-side. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
