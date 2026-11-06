"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { services, states } from "@/lib/site";
import { BrandSpinner } from "@/components/brand-spinner";
import { submitQuoteAction } from "@/app/(site)/actions";
import type { SubmitState } from "@/lib/forms";
import { Honeypot } from "@/components/form-protection";

const field =
  "h-11 w-full rounded-btn border border-border bg-background px-3.5 text-base text-foreground placeholder:text-muted focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-ring";
const label = "mb-1.5 block text-sm font-medium text-foreground";

const initialState: SubmitState = { ok: false };

export function QuoteForm({
  onDone,
  presetService,
}: {
  onDone?: () => void;
  presetService?: string;
}) {
  const [state, formAction, pending] = useActionState(submitQuoteAction, initialState);

  if (state.ok) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-eco-500/15 text-eco-600">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h3 className="mt-5 text-xl font-bold text-foreground">Request received</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Thanks for reaching out. Our team will review your details and get back to
          you with a tailored quote within 2 hours during business hours.
        </p>
        <button
          type="button"
          onClick={onDone}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-btn bg-gradient-brand px-6 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97]"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
      {state.error && (
        <p className="sm:col-span-2 rounded-btn border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-300">
          {state.error}
        </p>
      )}
      <div className="sm:col-span-2">
        <label className={label} htmlFor="q-name">
          Full name <span className="text-red-500">*</span>
        </label>
        <input id="q-name" name="name" type="text" required autoComplete="name" className={field} placeholder="Jane Smith" />
      </div>

      <div>
        <label className={label} htmlFor="q-company">
          Company <span className="text-muted">(optional)</span>
        </label>
        <input id="q-company" name="company" type="text" autoComplete="organization" className={field} placeholder="Company name" />
      </div>

      <div>
        <label className={label} htmlFor="q-email">
          Email <span className="text-red-500">*</span>
        </label>
        <input id="q-email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@example.com" />
      </div>

      <div>
        <label className={label} htmlFor="q-phone">
          Phone <span className="text-red-500">*</span>
        </label>
        <input id="q-phone" name="phone" type="tel" inputMode="tel" required autoComplete="tel" className={field} placeholder="0451 930 257" />
      </div>

      <div>
        <label className={label} htmlFor="q-state">
          State <span className="text-red-500">*</span>
        </label>
        <select id="q-state" name="state" required defaultValue="" className={field}>
          <option value="" disabled>
            Choose a state
          </option>
          {states.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name} ({s.code})
              {s.status === "launching" ? " - launching soon" : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={label} htmlFor="q-suburb">
          Suburb <span className="text-muted">(optional)</span>
        </label>
        <input id="q-suburb" name="suburb" type="text" className={field} placeholder="e.g. Parramatta" />
      </div>

      <div>
        <label className={label} htmlFor="q-service">
          Service needed <span className="text-red-500">*</span>
        </label>
        <select
          id="q-service"
          name="service"
          required
          defaultValue={presetService ?? ""}
          className={field}
        >
          <option value="" disabled>
            Choose a service
          </option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className={label} htmlFor="q-message">
          Anything else? <span className="text-muted">(optional)</span>
        </label>
        <textarea
          id="q-message"
          name="message"
          rows={3}
          className="w-full rounded-btn border border-border bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Size of the space, frequency, preferred times..."
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
            <BrandSpinner size={18} /> Sending your request
          </>
        ) : (
          "Get My Free Quote"
        )}
      </button>

      <p className="col-span-1 text-center text-xs text-muted sm:col-span-2">
        We reply within 2 hours during business hours. No obligation, no lock-in
        contracts.
      </p>
    </form>
  );
}
