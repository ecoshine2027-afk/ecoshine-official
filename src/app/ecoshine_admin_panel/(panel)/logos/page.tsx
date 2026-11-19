import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import { getTrustedLogos } from "@/lib/content";
import { addTrustedLogoAction, deleteTrustedLogoAction } from "@/app/ecoshine_admin_panel/actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { cardCls, dangerBtnCls, inputCls, labelCls, primaryBtnCls } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";

export default async function AdminLogosPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const logos = await getTrustedLogos();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Trusted Logos</h1>
      <p className="mt-1 text-sm text-muted">
        Client logos shown in the &quot;Trusted by leading companies&quot; strip under the
        homepage hero. Transparent PNG or WebP works best.
      </p>
      <SavedBanner saved={saved} error={error} />

      <form action={addTrustedLogoAction} className={`${cardCls} mt-6 space-y-4`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="imageFile" className={labelCls}>
              Logo image (JPG, PNG or WebP, max 8MB)
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
            <label htmlFor="name" className={labelCls}>
              Company name
            </label>
            <input
              id="name"
              name="name"
              required
              maxLength={60}
              placeholder="e.g. Jetstar"
              className={inputCls}
            />
          </div>
        </div>
        <SubmitButton className={primaryBtnCls} pendingText="Uploading…">
          <Upload className="h-4 w-4" />
          Add Logo
        </SubmitButton>
      </form>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {logos.map((logo) => (
          <div key={logo.src} className="overflow-hidden rounded-card border border-border bg-card">
            <div className="flex h-24 items-center justify-center bg-white p-4">
              <Image
                src={logo.src}
                alt={logo.name}
                width={180}
                height={64}
                className="h-12 w-auto max-w-[150px] object-contain"
              />
            </div>
            <div className="space-y-2 border-t border-border p-3">
              <p className="truncate text-xs font-semibold text-foreground">{logo.name}</p>
              <form action={deleteTrustedLogoAction}>
                <input type="hidden" name="src" value={logo.src} />
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
