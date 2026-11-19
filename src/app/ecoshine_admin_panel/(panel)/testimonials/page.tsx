import { Plus, Star, Trash2, Pencil } from "lucide-react";
import { getTestimonials, getBlogCategories, type Testimonial } from "@/lib/content";
import { deleteTestimonialAction, saveTestimonialAction } from "@/app/ecoshine_admin_panel/actions";
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

function TestimonialForm({
  item,
  categories,
}: {
  item?: Testimonial;
  categories: string[];
}) {
  const key = item?.id ?? "new";
  return (
    <form action={saveTestimonialAction} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls} htmlFor={`name-${key}`}>
            Customer name
          </label>
          <input
            id={`name-${key}`}
            name="name"
            required
            maxLength={60}
            defaultValue={item?.name}
            placeholder="e.g. Sarah M."
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor={`role-${key}`}>
            Role &amp; location
          </label>
          <input
            id={`role-${key}`}
            name="role"
            required
            maxLength={80}
            defaultValue={item?.role}
            placeholder="e.g. Office Manager, Sydney NSW"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor={`rating-${key}`}>
            Rating
          </label>
          <select
            id={`rating-${key}`}
            name="rating"
            required
            defaultValue={String(item?.rating ?? 5)}
            className={inputCls}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor={`service-${key}`}>
          Service or sector referenced
        </label>
        <select
          id={`service-${key}`}
          name="service"
          required
          defaultValue={item?.service ?? categories[0]}
          className={inputCls}
        >
          {item?.service && !categories.includes(item.service) && (
            <option value={item.service}>{item.service}</option>
          )}
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls} htmlFor={`text-${key}`}>
          Testimonial
        </label>
        <textarea
          id={`text-${key}`}
          name="text"
          required
          maxLength={500}
          defaultValue={item?.text}
          className={textareaCls}
        />
      </div>
      <SubmitButton className={primaryBtnCls}>
        {item ? "Save Testimonial" : (
          <>
            <Plus className="h-4 w-4" />
            Add Testimonial
          </>
        )}
      </SubmitButton>
    </form>
  );
}

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const [items, categories] = await Promise.all([getTestimonials(), getBlogCategories()]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
      <p className="mt-1 text-sm text-muted">
        Reviews shown in the homepage testimonials carousel.
      </p>
      <SavedBanner saved={saved} error={error} />

      {/* Add new */}
      <details className={`${cardCls} mt-6`}>
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-300">
          <Plus className="h-4 w-4" />
          Add a testimonial
        </summary>
        <div className="mt-4">
          <TestimonialForm categories={categories} />
        </div>
      </details>

      {/* List */}
      <div className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card">
        {items.length === 0 && (
          <p className="p-4 text-sm text-muted">No testimonials yet. Add the first one above.</p>
        )}
        {items.map((item) => (
          <details key={item.id} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="flex shrink-0 items-center gap-0.5 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </span>
                  <p className="truncate text-sm font-bold text-foreground">{item.name}</p>
                </div>
                <p className="truncate text-xs text-muted">
                  {item.role} · {item.service}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-btn border border-border px-3 py-1.5 text-xs font-semibold text-foreground group-open:border-brand-300 group-open:text-brand-600 dark:group-open:text-brand-300">
                <Pencil className="h-3.5 w-3.5" />
                <span className="group-open:hidden">Edit</span>
                <span className="hidden group-open:inline">Close</span>
              </span>
            </summary>
            <div className="border-t border-border p-4">
              <TestimonialForm item={item} categories={categories} />
              <form action={deleteTestimonialAction} className="mt-4 flex justify-end border-t border-border pt-4">
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
