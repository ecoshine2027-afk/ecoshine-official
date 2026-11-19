import Image from "next/image";
import { getHomepage, homepageSections } from "@/lib/content";
import { saveHomepageAction } from "@/app/ecoshine_admin_panel/actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { cardCls, inputCls, labelCls, primaryBtnCls, textareaCls } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";

const legendCls =
  "px-1 text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300";

/* Small typed field helpers so the (large) form stays readable. */
function Text({
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelCls}>
        {label}
      </label>
      <input id={name} name={name} required={required} defaultValue={defaultValue} className={inputCls} />
    </div>
  );
}

function Area({
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelCls}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className={`${textareaCls} min-h-20`}
      />
    </div>
  );
}

export default async function AdminHomepagePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const home = await getHomepage();
  const { hero } = home;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Homepage</h1>
      <p className="mt-1 text-sm text-muted">
        Edit every section of the homepage — text, lists and which sections are shown.
      </p>
      <SavedBanner saved={saved} error={error} />

      <form action={saveHomepageAction} className="mt-6 space-y-4">
        {/* ---- Section visibility ---- */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Sections shown on the homepage</legend>
          <p className="mt-2 text-sm text-muted">
            Untick a section to hide it from the live homepage. The hero always shows.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {homepageSections.map((s) => (
              <label
                key={s.key}
                className="flex cursor-pointer items-center gap-2.5 rounded-btn border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-foreground"
              >
                <input
                  type="checkbox"
                  name={`visible-${s.key}`}
                  defaultChecked={home.visible[s.key] !== false}
                  className="h-4 w-4 accent-brand-600"
                />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* ---- Hero ---- */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Hero</legend>
          <div className="mt-2 space-y-4">
            <Text name="badge" label="Badge text (optional — leave blank to hide)" defaultValue={hero.badge} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Text name="titlePre" label="Heading, first part" defaultValue={hero.titlePre} required />
              <Text name="titleHighlight" label="Heading, highlighted part" defaultValue={hero.titleHighlight} required />
              <Text name="titlePost" label="Heading, last part" defaultValue={hero.titlePost} />
            </div>
            <Area name="description" label="Description" defaultValue={hero.description} required />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Text name="ratingValue" label="Rating value" defaultValue={hero.ratingValue} />
              <Text name="ratingNote" label="Rating note" defaultValue={hero.ratingNote} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[10rem_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-btn border border-border">
                <Image src={hero.image} alt={hero.imageAlt} fill sizes="160px" className="object-cover" />
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="imageFile" className={labelCls}>
                    Replace hero image (JPG, PNG or WebP, max 8MB)
                  </label>
                  <input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className={`${inputCls} cursor-pointer file:mr-3 file:cursor-pointer file:rounded-btn file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700`}
                  />
                  <input type="hidden" name="image" value={hero.image} />
                </div>
                <Text name="imageAlt" label="Image description (alt text)" defaultValue={hero.imageAlt} />
              </div>
            </div>
          </div>
        </fieldset>

        {/* ---- Services heading ---- */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Services grid heading</legend>
          <div className="mt-2 space-y-4">
            <Text name="services-eyebrow" label="Eyebrow" defaultValue={home.services.eyebrow} />
            <Text name="services-title" label="Title" defaultValue={home.services.title} required />
            <Area name="services-description" label="Description" defaultValue={home.services.description} />
          </div>
        </fieldset>

        {/* ---- Why choose ---- */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Why choose us</legend>
          <div className="mt-2 space-y-4">
            <Text name="whyChoose-eyebrow" label="Eyebrow" defaultValue={home.whyChoose.eyebrow} />
            <Text name="whyChoose-title" label="Title" defaultValue={home.whyChoose.title} required />
            <Area name="whyChoose-description" label="Description" defaultValue={home.whyChoose.description} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Text name="whyChoose-badgeValue" label="Photo badge value (e.g. 8+)" defaultValue={home.whyChoose.badgeValue} />
              <Text name="whyChoose-badgeLabel" label="Photo badge label" defaultValue={home.whyChoose.badgeLabel} />
            </div>
            <div>
              <p className={labelCls}>Advantage list</p>
              <div className="mt-1.5 space-y-2">
                {home.whyChoose.advantages.map((a, i) => (
                  <input key={i} name={`advantage-${i}`} defaultValue={a} className={inputCls} />
                ))}
              </div>
            </div>
            <div>
              <p className={labelCls}>Trust pillars (icons stay fixed)</p>
              <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {home.whyChoose.trustPoints.map((p, i) => (
                  <div key={i} className="rounded-btn border border-border bg-surface p-3">
                    <input name={`trust-title-${i}`} defaultValue={p.title} className={inputCls} placeholder="Title" />
                    <textarea name={`trust-text-${i}`} defaultValue={p.text} className={`${textareaCls} mt-2 min-h-16`} placeholder="Text" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </fieldset>

        {/* ---- Our difference ---- */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Our difference</legend>
          <div className="mt-2 space-y-4">
            <Text name="ourDifference-eyebrow" label="Eyebrow" defaultValue={home.ourDifference.eyebrow} />
            <Text name="ourDifference-title" label="Title" defaultValue={home.ourDifference.title} required />
            <Area name="ourDifference-description" label="Description" defaultValue={home.ourDifference.description} />
            <Text name="ourDifference-overlayTitle" label="Banner title" defaultValue={home.ourDifference.overlayTitle} />
            <Area name="ourDifference-overlayText1" label="Banner paragraph 1" defaultValue={home.ourDifference.overlayText1} />
            <Area name="ourDifference-overlayText2" label="Banner paragraph 2" defaultValue={home.ourDifference.overlayText2} />
            <div>
              <p className={labelCls}>Stats</p>
              <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {home.ourDifference.stats.map((s, i) => (
                  <div key={i} className="rounded-btn border border-border bg-surface p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input name={`stat-value-${i}`} defaultValue={s.value} className={inputCls} placeholder="Value" />
                      <input name={`stat-label-${i}`} defaultValue={s.label} className={inputCls} placeholder="Label" />
                    </div>
                    <textarea name={`stat-text-${i}`} defaultValue={s.text} className={`${textareaCls} mt-2 min-h-16`} placeholder="Text" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </fieldset>

        {/* ---- Coverage ---- */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Coverage map heading</legend>
          <div className="mt-2 space-y-4">
            <Text name="coverage-eyebrow" label="Eyebrow" defaultValue={home.coverage.eyebrow} />
            <Text name="coverage-title" label="Title" defaultValue={home.coverage.title} required />
            <Area name="coverage-description" label="Description" defaultValue={home.coverage.description} />
          </div>
        </fieldset>

        {/* ---- How it works ---- */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>How it works</legend>
          <div className="mt-2 space-y-4">
            <Text name="howItWorks-eyebrow" label="Eyebrow" defaultValue={home.howItWorks.eyebrow} />
            <Text name="howItWorks-title" label="Title" defaultValue={home.howItWorks.title} required />
            <div>
              <p className={labelCls}>Steps (numbered automatically)</p>
              <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {home.howItWorks.steps.map((s, i) => (
                  <div key={i} className="rounded-btn border border-border bg-surface p-3">
                    <input name={`step-title-${i}`} defaultValue={s.title} className={inputCls} placeholder="Step title" />
                    <textarea name={`step-text-${i}`} defaultValue={s.text} className={`${textareaCls} mt-2 min-h-16`} placeholder="Step text" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </fieldset>

        {/* ---- Satisfaction band ---- */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Satisfaction guarantee band</legend>
          <div className="mt-2 space-y-4">
            <Text name="satisfaction-title" label="Title" defaultValue={home.satisfaction.title} required />
            <Area name="satisfaction-text" label="Text" defaultValue={home.satisfaction.text} />
          </div>
        </fieldset>

        {/* ---- Gallery heading ---- */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Work gallery heading</legend>
          <div className="mt-2 space-y-4">
            <Text name="gallery-eyebrow" label="Eyebrow" defaultValue={home.gallery.eyebrow} />
            <Text name="gallery-title" label="Title" defaultValue={home.gallery.title} required />
            <Area name="gallery-description" label="Description" defaultValue={home.gallery.description} />
          </div>
        </fieldset>

        {/* ---- Testimonials heading ---- */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Testimonials heading</legend>
          <div className="mt-2 space-y-4">
            <Text name="testimonials-eyebrow" label="Eyebrow" defaultValue={home.testimonials.eyebrow} />
            <Text name="testimonials-title" label="Title" defaultValue={home.testimonials.title} required />
            <Area name="testimonials-description" label="Description" defaultValue={home.testimonials.description} />
            <Text name="testimonials-ratingLine" label="Rating line (leave blank to hide)" defaultValue={home.testimonials.ratingLine} />
          </div>
        </fieldset>

        {/* ---- FAQ heading ---- */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>FAQ heading</legend>
          <div className="mt-2 space-y-4">
            <Text name="faq-eyebrow" label="Eyebrow" defaultValue={home.faq.eyebrow} />
            <Text name="faq-title" label="Title" defaultValue={home.faq.title} required />
            <Area name="faq-description" label="Description" defaultValue={home.faq.description} />
          </div>
        </fieldset>

        {/* ---- Lead capture ---- */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Closing call-to-action</legend>
          <div className="mt-2 space-y-4">
            <Text name="leadCapture-title" label="Title" defaultValue={home.leadCapture.title} required />
            <Area name="leadCapture-description" label="Description" defaultValue={home.leadCapture.description} />
            <Text name="leadCapture-buttonLabel" label="Button label" defaultValue={home.leadCapture.buttonLabel} />
          </div>
        </fieldset>

        <div className="sticky bottom-4 flex justify-end">
          <SubmitButton className={`${primaryBtnCls} shadow-lg`}>Save Homepage</SubmitButton>
        </div>
      </form>
    </div>
  );
}
