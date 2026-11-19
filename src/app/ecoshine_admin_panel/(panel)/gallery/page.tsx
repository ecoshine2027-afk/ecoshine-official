import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import { getGallery } from "@/lib/content";
import { addGalleryImageAction, deleteGalleryImageAction } from "@/app/ecoshine_admin_panel/actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { cardCls, dangerBtnCls, inputCls, labelCls, primaryBtnCls } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const gallery = await getGallery();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
      <p className="mt-1 text-sm text-muted">
        These photos appear on the Gallery page and in the homepage &quot;Our work&quot;
        section (first five).
      </p>
      <SavedBanner saved={saved} error={error} />

      {/* Upload */}
      <form action={addGalleryImageAction} className={`${cardCls} mt-6 space-y-4`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="imageFile" className={labelCls}>
              Image (JPG, PNG or WebP, max 8MB)
            </label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              required
              accept="image/jpeg,image/png,image/webp,image/avif"
              className={`${inputCls} cursor-pointer file:mr-3 file:cursor-pointer file:rounded-btn file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700`}
            />
          </div>
          <div>
            <label htmlFor="alt" className={labelCls}>
              Description (alt text)
            </label>
            <input
              id="alt"
              name="alt"
              placeholder="e.g. Ecoshine cleaner detailing an office kitchen"
              className={inputCls}
            />
          </div>
        </div>
        <SubmitButton className={primaryBtnCls} pendingText="Uploading…">
          <Upload className="h-4 w-4" />
          Upload Image
        </SubmitButton>
      </form>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.shots.map((shot) => (
          <div key={shot.src} className="overflow-hidden rounded-card border border-border bg-card">
            <div className="relative aspect-[4/3]">
              <Image src={shot.src} alt={shot.alt} fill sizes="200px" className="object-cover" />
            </div>
            <div className="space-y-2 p-3">
              <p className="line-clamp-2 text-xs leading-snug text-muted">{shot.alt}</p>
              <form action={deleteGalleryImageAction}>
                <input type="hidden" name="src" value={shot.src} />
                <SubmitButton className={dangerBtnCls} pendingText="Removing…" spinnerSize={14}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </SubmitButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
