import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getSectors, getPageHero } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("sectors");
}

export default async function SectorsPage() {
  const sectors = await getSectors();
  const pageHero = await getPageHero("sectors", {
    title: "Tailored Solutions for Every Sector",
    subtitle:
      "Each industry has unique requirements. We deliver compliant, scalable cleaning and facility solutions that address sector-specific risks and priorities.",
  });

  return (
    <>
      <PageHero
        title={pageHero.title}
        subtitle={pageHero.subtitle}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Sector" }]}
      />
      <section className="container-page py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((s) => {
            const Icon = resolveIcon(s.icon);
            return (
              <Link
                key={s.slug}
                href={`/sectors/${s.slug}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-card shadow-sm"
              >
                <Image
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-900/40 to-brand-900/5" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-3 text-base font-bold leading-snug text-white">{s.name}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-white/75">{s.blurb}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
