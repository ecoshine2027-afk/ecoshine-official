import { Plus, Pencil, Trash2, MapPin, Sparkles } from "lucide-react";
import { getServiceAreas, type ServiceArea } from "@/lib/content";
import { saveServiceAreaAction, deleteServiceAreaAction } from "@/app/ecoshine_admin_panel/actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import {
  cardCls,
  inputCls,
  labelCls,
  primaryBtnCls,
  dangerBtnCls,
  textareaCls,
} from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";

function AreaForm({ item }: { item?: ServiceArea }) {
  const uid = item?.id ?? "new";
  return (
    <form action={saveServiceAreaAction} className="space-y-3">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor={`name-${uid}`}>
            Area name
          </label>
          <input
            id={`name-${uid}`}
            name="name"
            required
            maxLength={80}
            defaultValue={item?.name}
            placeholder="e.g. Queensland"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor={`status-${uid}`}>
            Status
          </label>
          <select
            id={`status-${uid}`}
            name="status"
            defaultValue={item?.status ?? "active"}
            className={inputCls}
          >
            <option value="active">Now servicing</option>
            <option value="launching">Launching soon</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor={`launchDate-${uid}`}>
            Launch date (only if launching)
          </label>
          <input
            id={`launchDate-${uid}`}
            name="launchDate"
            defaultValue={item?.launchDate}
            placeholder="e.g. 1 July 2026"
            className={inputCls}
          />
        </div>
        <div className="flex items-end">
          <label className="inline-flex cursor-pointer items-center gap-2 pb-2.5 text-sm font-semibold text-foreground">
            <input
              type="checkbox"
              name="isHq"
              defaultChecked={item?.isHq}
              className="h-4 w-4 cursor-pointer accent-brand-600"
            />
            Mark as head office
          </label>
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor={`tagline-${uid}`}>
          Tagline
        </label>
        <input
          id={`tagline-${uid}`}
          name="tagline"
          required
          maxLength={200}
          defaultValue={item?.tagline}
          placeholder="Short line describing this area."
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor={`cities-${uid}`}>
          Cities / suburbs (one per line, or comma-separated)
        </label>
        <textarea
          id={`cities-${uid}`}
          name="cities"
          defaultValue={item?.cities.join("\n")}
          placeholder={"Sydney\nParramatta\nNewcastle"}
          className={`${textareaCls} min-h-24`}
        />
      </div>

      <SubmitButton className={primaryBtnCls}>
        {item ? (
          "Save area"
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add area
          </>
        )}
      </SubmitButton>
    </form>
  );
}

export default async function AdminServiceAreasPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const areas = await getServiceAreas();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Service Areas</h1>
      <p className="mt-1 text-sm text-muted">
        Add, edit or remove the areas shown on the <code>/service-areas</code> page. The
        stylised map on the homepage stays fixed (it needs set map coordinates).
      </p>
      <SavedBanner saved={saved} error={error} />

      {/* Add new */}
      <details className={`${cardCls} mt-6`}>
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-300">
          <Plus className="h-4 w-4" />
          Add a service area
        </summary>
        <div className="mt-4">
          <AreaForm />
        </div>
      </details>

      {/* List */}
      <div className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card">
        {areas.length === 0 && (
          <p className="p-4 text-sm text-muted">No areas yet. Add the first one above.</p>
        )}
        {areas.map((a) => (
          <details key={a.id} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
                  <MapPin className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-foreground">{a.name}</p>
                    {a.isHq && (
                      <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 dark:bg-brand-600/15 dark:text-brand-300">
                        HQ
                      </span>
                    )}
                    {a.status === "launching" && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                        <Sparkles className="h-2.5 w-2.5" />
                        {a.launchDate || "Launching"}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted">{a.cities.length} cities · {a.tagline}</p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-btn border border-border px-3 py-1.5 text-xs font-semibold text-foreground group-open:border-brand-300 group-open:text-brand-600 dark:group-open:text-brand-300">
                <Pencil className="h-3.5 w-3.5" />
                <span className="group-open:hidden">Edit</span>
                <span className="hidden group-open:inline">Close</span>
              </span>
            </summary>
            <div className="border-t border-border p-4">
              <AreaForm item={a} />
              <form action={deleteServiceAreaAction} className="mt-4 flex justify-end border-t border-border pt-4">
                <input type="hidden" name="id" value={a.id} />
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
