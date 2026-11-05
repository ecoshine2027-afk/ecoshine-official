"use client";

import { useEffect, useRef } from "react";
import { HONEYPOT_FIELD } from "@/lib/forms";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
    };
  }
}

/** Cloudflare Turnstile widget. Renders nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY
    is set. On submit it adds a hidden `cf-turnstile-response` token the server
    verifies. Uses explicit rendering so it also works inside the quote modal. */
export function TurnstileWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !ref.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(ref.current, { sitekey: SITE_KEY, theme: "auto" });
    };

    if (!document.querySelector(`script[src^="https://challenges.cloudflare.com/turnstile"]`)) {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      render();
    }

    // The script may load a moment before window.turnstile is ready.
    const poll = setInterval(render, 300);
    const stop = setTimeout(() => clearInterval(poll), 5000);

    return () => {
      cancelled = true;
      clearInterval(poll);
      clearTimeout(stop);
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
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
