import type { Metadata } from "next";
import { Briefcase, MapPin, Clock, Mail } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { getJobs, getPageHero, getSettings } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("careers");
}

export default async function CareersPage() {
  const [jobs, settings, hero] = await Promise.all([
    getJobs(),
    getSettings(),
    getPageHero("careers", {
      title: "Careers at Ecoshine Solution",
      subtitle:
        "Join a growing team of eco-certified, police-checked cleaning professionals across Australia.",
    }),
  ]);
  const openings = jobs.filter((j) => j.active);

  return (
    <>
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Careers" }]}
      />

      <section className="container-page py-16">
        <h2 className="text-2xl font-bold text-foreground">
          Current Openings{openings.length > 0 && ` (${openings.length})`}
        </h2>

        {openings.length === 0 ? (
          <Reveal className="mt-6 rounded-card border border-border bg-card p-8 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
              <Briefcase className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-foreground">
              No open roles right now
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              We&apos;re always keen to hear from experienced, reliable cleaners. Send your
              resume and we&apos;ll keep it on file for the next opening.
            </p>
            <a
              href={`mailto:${settings.email}?subject=Expression of interest - Careers at Ecoshine`}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-btn bg-gradient-brand px-6 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 transition-all hover:brightness-110"
            >
              <Mail className="h-4 w-4" />
              Email Your Resume
            </a>
          </Reveal>
        ) : (
          <Reveal className="mt-6 space-y-4">
            {openings.map((job) => (
              <article
                key={job.id}
                className="rounded-card border border-border bg-card p-6 transition-all hover:border-brand-300 hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-medium text-muted">
                      {job.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-brand-600" />
                          {job.location}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-brand-600" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`mailto:${settings.email}?subject=Application: ${encodeURIComponent(job.title)}`}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-btn bg-gradient-brand px-5 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 transition-all hover:brightness-110"
                  >
                    Apply Now
                  </a>
                </div>
                {job.description && (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
                    {job.description}
                  </p>
                )}
              </article>
            ))}
          </Reveal>
        )}
      </section>
    </>
  );
}
