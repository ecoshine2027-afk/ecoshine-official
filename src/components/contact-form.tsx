"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { BrandSpinner } from "@/components/brand-spinner";
import { submitContactAction } from "@/app/(site)/actions";
import type { SubmitState } from "@/lib/forms";
import { Honeypot } from "@/components/form-protection";

const field =
  "h-11 w-full rounded-btn border border-border bg-background px-3.5 text-base text-foreground placeholder:text-muted focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-ring";
const label = "mb-1.5 block text-sm font-medium text-foreground";

const initialState: SubmitState = { ok: false };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, initialState);

  if (state.ok) {
    return (
      <div className="flex flex-col items-center rounded-card border border-border bg-card px-6 py-12 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-eco-500/15 text-eco-600">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h3 className="mt-5 text-xl font-bold text-foreground">Message sent</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Thanks for reaching out. Our team will get back to you within 2 hours during
          business hours.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative rounded-card border border-border bg-card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-foreground">Send us a message</h2>
      <p className="mt-1 text-sm text-muted">
        Fill in the form and we&apos;ll reply as soon as we can.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {state.error && (
          <p className="sm:col-span-2 rounded-btn border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-300">
            {state.error}
          </p>
        )}

        <div>
          <label className={label} htmlFor="c-name">
            Full name <span className="text-red-500">*</span>
          </label>
          <input id="c-name" name="name" type="text" required autoComplete="name" className={field} placeholder="Jane Smith" />
        </div>

        <div>
          <label className={label} htmlFor="c-phone">
            Phone <span className="text-muted">(optional)</span>
          </label>
          <input id="c-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={field} placeholder="0451 930 257" />
        </div>

        <div>
          <label className={label} htmlFor="c-email">
            Email <span className="text-red-500">*</span>
          </label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@example.com" />
        </div>

        <div>
          <label className={label} htmlFor="c-subject">
            Subject <span className="text-muted">(optional)</span>
          </label>
          <input id="c-subject" name="subject" type="text" className={field} placeholder="What's it about?" />
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="c-message">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="c-message"
            name="message"
            rows={5}
            required
            className="w-full rounded-btn border border-border bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Tell us how we can help..."
          />
        </div>

        <Honeypot />

        <button
          type="submit"
          disabled={pending}
          className="col-span-1 mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-btn bg-gradient-brand px-6 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-70 sm:col-span-2"
        >
          {pending ? (
            <>
              <BrandSpinner size={18} /> Sending your message
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </div>
    </form>
  );
}
