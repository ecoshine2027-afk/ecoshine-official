import { Mail, Phone, Building2, MapPin, Inbox } from "lucide-react";
import { getSubmissions } from "@/lib/content";
import {
  markSubmissionReadAction,
  deleteSubmissionAction,
  markAllSubmissionsReadAction,
} from "@/app/ecoshine_admin_panel/actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { cardCls, secondaryBtnCls, dangerBtnCls } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const submissions = await getSubmissions();
  const unread = submissions.filter((s) => !s.read).length;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Enquiries</h1>
          <p className="mt-1 text-sm text-muted">
            Quote requests and contact messages submitted from the website.
            {unread > 0 && (
              <span className="ml-1 font-semibold text-brand-600 dark:text-brand-300">
                {unread} unread.
              </span>
            )}
          </p>
        </div>
        {unread > 0 && (
          <form action={markAllSubmissionsReadAction}>
            <SubmitButton className={secondaryBtnCls} pendingText="…" spinnerSize={14}>
              Mark all read
            </SubmitButton>
          </form>
        )}
      </div>

      <SavedBanner saved={saved} error={error} />

      {submissions.length === 0 ? (
        <div className={`${cardCls} mt-6 flex flex-col items-center py-16 text-center`}>
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
            <Inbox className="h-7 w-7" />
          </span>
          <p className="mt-4 text-sm font-semibold text-foreground">No enquiries yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            When someone submits the contact form or requests a quote, it will show up here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {submissions.map((s) => (
            <div
              key={s.id}
              className={`rounded-card border bg-card p-5 ${
                s.read ? "border-border" : "border-brand-300 ring-1 ring-brand-300/40"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                    s.kind === "quote"
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-600/15 dark:text-brand-300"
                      : "bg-eco-500/15 text-eco-600"
                  }`}
                >
                  {s.kind === "quote" ? "Quote request" : "Contact"}
                </span>
                {!s.read && (
                  <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-600">
                    New
                  </span>
                )}
                <span className="ml-auto text-xs text-muted">{formatDate(s.createdAt)}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-base font-bold text-foreground">{s.name}</p>
                <p className="text-sm font-medium text-brand-600 dark:text-brand-300">{s.subject}</p>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
                <a href={`mailto:${s.email}`} className="inline-flex items-center gap-1.5 hover:text-brand-600">
                  <Mail className="h-4 w-4" /> {s.email}
                </a>
                {s.phone && (
                  <a
                    href={`tel:+61${s.phone.replace(/\D/g, "").replace(/^0/, "")}`}
                    className="inline-flex items-center gap-1.5 hover:text-brand-600"
                  >
                    <Phone className="h-4 w-4" /> {s.phone}
                  </a>
                )}
                {s.meta.company && (
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" /> {s.meta.company}
                  </span>
                )}
                {(s.meta.state || s.meta.suburb) && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {[s.meta.suburb, s.meta.state].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>

              {s.message && (
                <p className="mt-3 whitespace-pre-wrap rounded-btn bg-surface p-3 text-sm leading-relaxed text-foreground">
                  {s.message}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <form action={markSubmissionReadAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="read" value={s.read ? "false" : "true"} />
                  <SubmitButton className={secondaryBtnCls} pendingText="…" spinnerSize={14}>
                    {s.read ? "Mark unread" : "Mark read"}
                  </SubmitButton>
                </form>
                <form action={deleteSubmissionAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <SubmitButton className={dangerBtnCls} pendingText="Deleting…" spinnerSize={14}>
                    Delete
                  </SubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
