"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { BrandSpinner } from "@/components/brand-spinner";
import { primaryBtnCls } from "@/components/admin/ui";

/** Submit button that shows a spinner + "Saving…" while its form's server
    action is running, so admin saves/adds/deletes feel responsive instead of
    frozen. Uses useFormStatus, so it must live inside the <form> it submits. */
export function SubmitButton({
  children,
  className = primaryBtnCls,
  pendingText = "Saving…",
  spinnerSize = 18,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  pendingText?: string;
  spinnerSize?: number;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-label={ariaLabel}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {pending ? (
        <>
          <BrandSpinner size={spinnerSize} />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
