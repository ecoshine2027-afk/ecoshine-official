import Image from "next/image";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { getAbout, type Founder } from "@/lib/content";
import {
  saveAboutAction,
  saveFounderAction,
  deleteFounderAction,
} from "@/app/ecoshine_admin_panel/actions";
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

const legendCls =
  "px-1 text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300";

function FounderForm({ item }: { item?: Founder }) {
  const uid = item?.id ?? "new";
  return (
    <form action={saveFounderAction} className="space-y-3">
      {item && <input type="hidden" name="id" value={item.id} />}
      {item && <input type="hidden" name="image" value={item.image} />}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor={`name-${uid}`}>
            Name
          </label>
          <input
            id={`name-${uid}`}
            name="name"
            required
            maxLength={80}
            defaultValue={item?.name}
            placeholder="e.g. Bikas Subedi"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor={`role-${uid}`}>
            Role
          </label>
          <input
            id={`role-${uid}`}
            name="role"
            required
            defaultValue={item?.role}
            placeholder="e.g. Founder and CEO"
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor={`quote-${uid}`}>
          Quote
        </label>
        <textarea
          id={`quote-${uid}`}
          name="quote"
          required
          maxLength={600}
          defaultValue={item?.quote}
          className={`${textareaCls} min-h-24`}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor={`linkedin-${uid}`}>
            LinkedIn URL (optional)
          </label>
          <input
            id={`linkedin-${uid}`}
            name="linkedin"
            type="url"
            defaultValue={item && item.linkedin !== "#" ? item.linkedin : ""}
            placeholder="https://linkedin.com/in/…"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor={`imageFile-${uid}`}>
            Portrait photo (optional — initials show if empty)
          </label>
          <input
            id={`imageFile-${uid}`}
            name="imageFile"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className={`${inputCls} cursor-pointer file:mr-3 file:cursor-pointer file:rounded-btn file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700`}
          />
        </div>
      </div>
      <SubmitButton className={primaryBtnCls}>
        {item ? (
          "Save founder"
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add founder
          </>
        )}
      </SubmitButton>
    </form>
  );
}

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const about = await getAbout();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">About Page</h1>
      <p className="mt-1 text-sm text-muted">
        Edit the content of the <code>/about</code> page. The hero title &amp; subtitle live
        under <span className="font-semibold">Page Titles</span>, and the values cards come
        from <span className="font-semibold">Homepage → trust pillars</span>.
      </p>
      <SavedBanner saved={saved} error={error} />

      <form action={saveAboutAction} className="mt-6 space-y-4">
        {/* Story */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Our story section</legend>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-[10rem_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-btn border border-border">
              <Image src={about.storyImage} alt={about.storyImageAlt} fill sizes="160px" className="object-cover" />
            </div>
            <div className="space-y-3">
              <div>
                <label className={labelCls} htmlFor="storyEyebrow">
                  Eyebrow
                </label>
                <input id="storyEyebrow" name="storyEyebrow" defaultValue={about.storyEyebrow} className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="storyTitle">
                  Heading
                </label>
                <input id="storyTitle" name="storyTitle" required defaultValue={about.storyTitle} className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="imageFile">
                  Replace photo
                </label>
                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className={`${inputCls} cursor-pointer file:mr-3 file:cursor-pointer file:rounded-btn file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700`}
                />
                <input type="hidden" name="storyImage" value={about.storyImage} />
              </div>
              <div>
                <label className={labelCls} htmlFor="storyImageAlt">
                  Photo description (alt text)
                </label>
                <input id="storyImageAlt" name="storyImageAlt" defaultValue={about.storyImageAlt} className={inputCls} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <label className={labelCls} htmlFor="storyBody1">
              First paragraph
            </label>
            <textarea id="storyBody1" name="storyBody1" required defaultValue={about.storyBody1} className={`${textareaCls} min-h-24`} />
          </div>
          <div className="mt-3">
            <label className={labelCls} htmlFor="storyBody2">
              Second paragraph (optional)
            </label>
            <textarea id="storyBody2" name="storyBody2" defaultValue={about.storyBody2} className={`${textareaCls} min-h-24`} />
          </div>
        </fieldset>

        {/* Values heading */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Values section heading</legend>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="valuesEyebrow">
                Eyebrow
              </label>
              <input id="valuesEyebrow" name="valuesEyebrow" defaultValue={about.valuesEyebrow} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="valuesTitle">
                Heading
              </label>
              <input id="valuesTitle" name="valuesTitle" required defaultValue={about.valuesTitle} className={inputCls} />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted">
            The cards below this heading are the trust pillars edited on the Homepage.
          </p>
        </fieldset>

        {/* Founders heading */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Founders section heading</legend>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="foundersEyebrow">
                Eyebrow
              </label>
              <input id="foundersEyebrow" name="foundersEyebrow" defaultValue={about.foundersEyebrow} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="foundersTitle">
                Heading
              </label>
              <input id="foundersTitle" name="foundersTitle" required defaultValue={about.foundersTitle} className={inputCls} />
            </div>
          </div>
        </fieldset>

        <SubmitButton className={primaryBtnCls}>Save Page Content</SubmitButton>
      </form>

      {/* Founders management */}
      <h2 className="mt-10 text-lg font-bold text-foreground">Founders</h2>
      <details className={`${cardCls} mt-3`}>
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-300">
          <Plus className="h-4 w-4" />
          Add a founder
        </summary>
        <div className="mt-4">
          <FounderForm />
        </div>
      </details>

      <div className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card">
        {about.founders.length === 0 && (
          <p className="p-4 text-sm text-muted">No founders yet. Add the first one above.</p>
        )}
        {about.founders.map((f) => (
          <details key={f.id} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-brand text-xs font-bold text-white">
                  {f.image ? (
                    <Image src={f.image} alt={f.name} fill sizes="40px" className="object-cover" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{f.name}</p>
                  <p className="truncate text-xs text-muted">{f.role}</p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-btn border border-border px-3 py-1.5 text-xs font-semibold text-foreground group-open:border-brand-300 group-open:text-brand-600 dark:group-open:text-brand-300">
                <Pencil className="h-3.5 w-3.5" />
                <span className="group-open:hidden">Edit</span>
                <span className="hidden group-open:inline">Close</span>
              </span>
            </summary>
            <div className="border-t border-border p-4">
              <FounderForm item={f} />
              <form action={deleteFounderAction} className="mt-4 flex justify-end border-t border-border pt-4">
                <input type="hidden" name="id" value={f.id} />
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
