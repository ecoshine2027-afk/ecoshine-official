import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { getPageHero, getAbout } from "@/lib/content";
import { Founders } from "@/components/founders";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { trustPoints } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("about");
}

export default async function AboutPage() {
  const [pageHero, about] = await Promise.all([
    getPageHero("about", {
      title: "About Ecoshine Solution",
      subtitle:
        "Eco-conscious, professional and affordable cleaning trusted by businesses and communities across Australia.",
    }),
    getAbout(),
  ]);

  return (
    <>
      <PageHero
        title={pageHero.title}
        subtitle={pageHero.subtitle}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Mission / story */}
      <section id="story" className="scroll-mt-24 py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-border shadow-lg">
              <Image
                src={about.storyImage}
                alt={about.storyImageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
              {about.storyEyebrow}
            </span>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
              {about.storyTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">{about.storyBody1}</p>
            {about.storyBody2 && (
              <p className="mt-4 text-base leading-relaxed text-muted">{about.storyBody2}</p>
            )}
            <ButtonLink href="/quote" className="mt-8">
              Get a Free Quote
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="scroll-mt-24 bg-surface py-20">
        <div className="container-page">
          <SectionHeading eyebrow={about.valuesEyebrow} title={about.valuesTitle} />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="flex flex-col items-center rounded-card border border-border bg-card p-6 text-center"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{point.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founders */}
      <Founders
        founders={about.founders}
        eyebrow={about.foundersEyebrow}
        title={about.foundersTitle}
      />
    </>
  );
}
