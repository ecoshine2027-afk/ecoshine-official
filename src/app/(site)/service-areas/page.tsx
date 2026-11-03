import type { Metadata } from "next";
import { MapPin, Sparkles } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getPageHero, getServiceAreas } from "@/lib/content";
import { PageCta } from "@/components/page-cta";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("service-areas");
}

export default async function ServiceAreasPage() {
  const [pageHero, areas] = await Promise.all([
    getPageHero("service-areas", {
      title: "Service Areas",
      subtitle:
        "Our local teams clean across five states and territories. Here is where you will find us.",
    }),
    getServiceAreas(),
  ]);

  return (
    <>
      <PageHero
        title={pageHero.title}
        subtitle={pageHero.subtitle}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Service Areas" }]}
      />
      <section className="container-page py-14">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {areas.map((s) => (
            <div key={s.id} className="rounded-card border border-border bg-card p-6">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{s.name}</h2>
                {s.isHq && (
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-600/15 dark:text-brand-300">
                    Head office
                  </span>
                )}
                {s.status === "launching" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-600">
                    <Sparkles className="h-3 w-3" />
                    Launching {s.launchDate}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted">{s.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.cities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground"
                  >
                    <MapPin className="h-3.5 w-3.5 text-brand-600" />
                    {city}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted">
          Don&apos;t see your suburb listed? We cover many more areas across each state and
          are always expanding. Get in touch and we&apos;ll confirm whether we service your
          location.
        </p>
      </section>

      <PageCta
        title="Ready to book a clean in your area?"
        description="Tell us where you are and what you need cleaned. We'll send a free, no-obligation quote within 2 hours during business hours."
      />
    </>
  );
}
