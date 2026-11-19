import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getServices } from "@/lib/content";
import { saveServiceAction, deleteServiceAction } from "@/app/ecoshine_admin_panel/actions";
import { serviceCategories } from "@/lib/site";
import { IconPicker } from "@/components/admin/icon-picker";
import { resolveIcon } from "@/lib/icons";
import { SavedBanner } from "@/components/admin/saved-banner";
import {
  cardCls,
  inputCls,
  labelCls,
  primaryBtnCls,
  dangerBtnCls,
  secondaryBtnCls,
  textareaCls,
} from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const services = await getServices();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="mt-1 text-sm text-muted">
            {services.length} services. Click <span className="font-semibold">Edit page</span> to
            change a service and everything on its own page.
          </p>
        </div>
      </div>
      <SavedBanner saved={saved} error={error} />

      {/* Add new */}
      <details className={`${cardCls} mt-6`}>
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-300">
          <Plus className="h-4 w-4" />
          Add a new service
        </summary>
        <form action={saveServiceAction} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="new-title">
                Full title
              </label>
              <input
                id="new-title"
                name="title"
                required
                maxLength={80}
                placeholder="e.g. Window & Glass Cleaning"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="new-short">
                Short name (menus & cards)
              </label>
              <input
                id="new-short"
                name="short"
                required
                maxLength={40}
                placeholder="e.g. Window & Glass"
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="new-category">
              Category
            </label>
            <select id="new-category" name="category" defaultValue={serviceCategories[0]} className={inputCls}>
              {serviceCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="new-blurb">
              Description
            </label>
            <textarea
              id="new-blurb"
              name="blurb"
              required
              maxLength={200}
              placeholder="One or two sentences describing this service."
              className={`${textareaCls} min-h-16`}
            />
          </div>
          <div>
            <label className={labelCls}>Icon</label>
            <div className="mt-1.5">
              <IconPicker name="icon" defaultValue="SprayCan" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="new-imageFile">
                Photo (optional)
              </label>
              <input
                id="new-imageFile"
                name="imageFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className={`${inputCls} cursor-pointer file:mr-3 file:cursor-pointer file:rounded-btn file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700`}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="new-imageAlt">
                Photo description (alt text)
              </label>
              <input id="new-imageAlt" name="imageAlt" placeholder="Describe the photo" className={inputCls} />
            </div>
          </div>
          <SubmitButton className={primaryBtnCls}>Add Service</SubmitButton>
        </form>
      </details>

      {/* List */}
      <div className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card">
        {services.map((s) => {
          const Icon = resolveIcon(s.icon);
          return (
            <div key={s.slug} className="flex items-center gap-4 p-3 sm:p-4">
              <div className="relative hidden h-14 w-20 shrink-0 overflow-hidden rounded-btn border border-border sm:block">
                <Image src={s.image} alt={s.imageAlt} fill sizes="80px" className="object-cover" />
              </div>
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">{s.title}</p>
                <p className="truncate text-xs text-muted">
                  {s.category} · /services/{s.slug}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link href={`/ecoshine_admin_panel/services/${s.slug}`} className={secondaryBtnCls}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit page
                </Link>
                <form action={deleteServiceAction}>
                  <input type="hidden" name="slug" value={s.slug} />
                  <SubmitButton className={dangerBtnCls} ariaLabel={`Delete ${s.title}`} pendingText="" spinnerSize={14}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </SubmitButton>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
