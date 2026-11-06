"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { QuoteForm } from "./quote-form";
import { BrandSpinner } from "@/components/brand-spinner";

export function QuoteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [ready, setReady] = useState(false);

  // Short branded loading state each time the popup opens.
  useEffect(() => {
    if (!open) return;
    // Reset to the loading state whenever the popup (re)opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(false);
    const t = setTimeout(() => setReady(true), 550);
    return () => clearTimeout(t);
  }, [open]);

  // Escape to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Request a free quote"
    >
      <div
        className="animate-fade-in absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="animate-fade-rise relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:max-h-[92vh] sm:max-w-xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border bg-gradient-brand px-6 py-5 text-white">
          <div>
            <h2 className="text-xl font-bold">Get a Free Quote</h2>
            <p className="mt-1 text-sm text-white/85">
              Tell us about your space and we will send a tailored quote.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 pt-6 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]">
          {ready ? (
            <QuoteForm onDone={onClose} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
              <BrandSpinner size={30} className="text-brand-600" />
              <p className="text-sm">Loading your quote form</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
