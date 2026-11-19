import { Plus, Trash2, Pencil } from "lucide-react";
import { getFaqs, type FaqItem } from "@/lib/content";
import { deleteFaqAction, saveFaqAction } from "@/app/ecoshine_admin_panel/actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import {
  cardCls,
  dangerBtnCls,
  inputCls,
  labelCls,
  primaryBtnCls,
  textareaCls,
} from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";

function FaqForm({ item }: { item?: FaqItem }) {
  const key = item?.id ?? "new";
  return (
    <form action={saveFaqAction} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div>
        <label className={labelCls} htmlFor={`question-${key}`}>
          Question
        </label>
        <input
          id={`question-${key}`}
          name="question"
          required
          maxLength={150}
          defaultValue={item?.question}
          placeholder="e.g. Do I need to sign a long-term contract?"
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls} htmlFor={`answer-${key}`}>
          Answer
        </label>
        <textarea
          id={`answer-${key}`}
          name="answer"
          required
          maxLength={600}
          defaultValue={item?.answer}
          className={textareaCls}
        />
      </div>
      <SubmitButton className={primaryBtnCls}>
        {item ? "Save FAQ" : (
          <>
            <Plus className="h-4 w-4" />
            Add FAQ
          </>
        )}
      </SubmitButton>
    </form>
  );
}

export default async function AdminFaqsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const items = await getFaqs();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">FAQs</h1>
      <p className="mt-1 text-sm text-muted">
        Questions shown in the FAQ accordion on the homepage.
      </p>
      <SavedBanner saved={saved} error={error} />

      {/* Add new */}
      <details className={`${cardCls} mt-6`}>
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-300">
          <Plus className="h-4 w-4" />
          Add a question
        </summary>
        <div className="mt-4">
          <FaqForm />
        </div>
      </details>

      {/* List */}
      <div className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card">
        {items.length === 0 && (
          <p className="p-4 text-sm text-muted">No questions yet. Add the first one above.</p>
        )}
        {items.map((item) => (
          <details key={item.id} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{item.question}</p>
                <p className="truncate text-xs text-muted">{item.answer}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-btn border border-border px-3 py-1.5 text-xs font-semibold text-foreground group-open:border-brand-300 group-open:text-brand-600 dark:group-open:text-brand-300">
                <Pencil className="h-3.5 w-3.5" />
                <span className="group-open:hidden">Edit</span>
                <span className="hidden group-open:inline">Close</span>
              </span>
            </summary>
            <div className="border-t border-border p-4">
              <FaqForm item={item} />
              <form action={deleteFaqAction} className="mt-4 flex justify-end border-t border-border pt-4">
                <input type="hidden" name="id" value={item.id} />
                <SubmitButton className={dangerBtnCls} pendingText="Deleting…" spinnerSize={14}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </SubmitButton>
              </form>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
