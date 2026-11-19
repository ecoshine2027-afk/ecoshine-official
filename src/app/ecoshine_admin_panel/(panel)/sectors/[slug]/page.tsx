import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { getSectors } from "@/lib/content";
import { saveSectorAction, deleteSectorAction } from "@/app/ecoshine_admin_panel/actions";
import { sectorStandards, serviceStandards } from "@/lib/site";
import { IconPicker } from "@/components/admin/icon-picker";
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

const legendCls =
  "px-1 text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300";

export default async function EditSectorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { slug } = await params;
  const { saved, error } = await searchParams;
  const sectors = await getSectors();
  const s = sectors.find((x) => x.slug === slug);
  if (!s) notFound();

  const base = sectorStandards[s.slug] ?? serviceStandards["Sector Programs"];
  const p = s.page ?? {};

  return (
    <div>
      <Link
        href="/ecoshine_admin_panel/sectors"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All sectors
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{s.name}</h1>
          <p className="mt-1 text-sm text-muted">/sectors/{s.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/sectors/${s.slug}`} target="_blank" className={secondaryBtnCls}>
            <ExternalLink className="h-3.5 w-3.5" />
            View live page
          </Link>
          <form action={deleteSectorAction}>
            <input type="hidden" name="slug" value={s.slug} />
            <SubmitButton className={dangerBtnCls} pendingText="Deleting…" spinnerSize={14}>
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </SubmitButton>
          </form>
        </div>
      </div>

      <SavedBanner saved={saved} error={error} />

      <form action={saveSectorAction} className="mt-6 space-y-4">
        <input type="hidden" name="slug" value={s.slug} />
        <input type="hidden" name="image" value={s.image} />

        {/* Basics */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Basics</legend>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-[10rem_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-btn border border-border">
              <Image src={s.image} alt={s.imageAlt} fill sizes="160px" className="object-cover" />
            </div>
            <div className="space-y-3">
              <div>
                <label className={labelCls} htmlFor="name">
                  Sector name
                </label>
                <input id="name" name="name" required maxLength={50} defaultValue={s.name} className={inputCls} />
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
              </div>
              <div>
                <label className={labelCls} htmlFor="imageAlt">
                  Photo description (alt text)
                </label>
                <input id="imageAlt" name="imageAlt" defaultValue={s.imageAlt} className={inputCls} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <label className={labelCls} htmlFor="blurb">
              Short description (menu, cards & page subtitle)
            </label>
            <textarea id="blurb" name="blurb" required maxLength={200} defaultValue={s.blurb} className={`${textareaCls} min-h-16`} />
          </div>
          <div className="mt-3">
            <label className={labelCls}>Icon</label>
            <div className="mt-1.5">
              <IconPicker name="icon" defaultValue={s.icon} />
            </div>
          </div>
        </fieldset>

        {/* Detail page content */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Detail page content</legend>
          <p className="mt-2 text-xs text-muted">
            Customise what appears on this sector&apos;s own page. Leave a field blank to keep the
            default — the greyed text shows what currently displays.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label className={labelCls} htmlFor="page-intro">
                Intro paragraph
              </label>
              <textarea
                id="page-intro"
                name="page-intro"
                defaultValue={p.intro}
                placeholder={`Default: ${s.blurb} Ecoshine's eco-certified, insured and police-checked teams…`}
                className={`${textareaCls} min-h-24`}
              />
            </div>

            <div className="rounded-btn border border-border p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                “Standards” section
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="page-standardsEyebrow">
                    Eyebrow
                  </label>
                  <input
                    id="page-standardsEyebrow"
                    name="page-standardsEyebrow"
                    defaultValue={p.standardsEyebrow}
                    placeholder={base.eyebrow}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="page-standardsTitle">
                    Title
                  </label>
                  <input
                    id="page-standardsTitle"
                    name="page-standardsTitle"
                    defaultValue={p.standardsTitle}
                    placeholder={base.title}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className={labelCls} htmlFor="page-standardsText">
                  Body text
                </label>
                <textarea
                  id="page-standardsText"
                  name="page-standardsText"
                  defaultValue={p.standardsText}
                  placeholder={base.text}
                  className={`${textareaCls} min-h-24`}
                />
              </div>
              <div className="mt-3">
                <label className={labelCls} htmlFor="page-standardsTagline">
                  Tagline
                </label>
                <input
                  id="page-standardsTagline"
                  name="page-standardsTagline"
                  defaultValue={p.standardsTagline}
                  placeholder={base.tagline}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="rounded-btn border border-border p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Call-to-action band
              </p>
              <div className="mt-3">
                <label className={labelCls} htmlFor="page-ctaTitle">
                  Heading
                </label>
                <input
                  id="page-ctaTitle"
                  name="page-ctaTitle"
                  defaultValue={p.ctaTitle}
                  placeholder={`Ready to Book a Clean for Your ${s.name} Site?`}
                  className={inputCls}
                />
              </div>
              <div className="mt-3">
                <label className={labelCls} htmlFor="page-ctaDescription">
                  Description
                </label>
                <input
                  id="page-ctaDescription"
                  name="page-ctaDescription"
                  defaultValue={p.ctaDescription}
                  placeholder="Tell us about your space and we'll send a tailored, no-obligation quote fast."
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </fieldset>

        <SubmitButton className={primaryBtnCls}>Save Changes</SubmitButton>
      </form>
    </div>
  );
}
