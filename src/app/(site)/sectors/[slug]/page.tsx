import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { DetailPage } from "@/components/detail-page";
import { sectorStandards, serviceStandards } from "@/lib/site";
import { getSectors, getSettings } from "@/lib/content";

export async function generateStaticParams() {
  const sectors = await getSectors();
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sectors = await getSectors();
  const sector = sectors.find((s) => s.slug === slug);
  if (!sector) return {};
  return {
    title: `${sector.name} Cleaning Sydney`,
    description: `${sector.blurb} Eco-certified, insured and police-checked commercial cleaning from Ecoshine Solution across Sydney and Australia.`,
    alternates: { canonical: `/sectors/${sector.slug}` },
  };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [sectors, settings] = await Promise.all([getSectors(), getSettings()]);
  const sector = sectors.find((s) => s.slug === slug);
  if (!sector) notFound();

  const related = sectors
    .filter((s) => s.slug !== sector.slug)
    .slice(0, 3)
    .map((s) => ({ label: s.name, href: `/sectors/${s.slug}` }));

  // Per-page overrides fall back to the computed defaults when left blank.
  const p = sector.page ?? {};
  const base = sectorStandards[sector.slug] ?? serviceStandards["Sector Programs"];
  const standards = {
    ...base,
    eyebrow: p.standardsEyebrow || base.eyebrow,
    title: p.standardsTitle || base.title,
    text: p.standardsText || base.text,
    tagline: p.standardsTagline || base.tagline,
  };

  return (
    <>
      <PageHero
        title={`${sector.name} Cleaning`}
        subtitle={sector.blurb}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Sectors", href: "/sectors" },
          { label: sector.name },
        ]}
      />
      <DetailPage
        intro={
          p.intro ||
          `${sector.blurb} Ecoshine's eco-certified, insured and police-checked teams tailor a cleaning program for every ${sector.name.toLowerCase()} site, backed by our satisfaction guarantee.`
        }
        image={sector.image}
        imageAlt={sector.imageAlt}
        expertiseContext={`${sector.name} Cleaning`}
        standards={standards}
        related={related}
        relatedLabel="Other Sectors We Service"
        trustPoints={settings.trustPoints}
        ctaTitle={p.ctaTitle || `Ready to Book a Clean for Your ${sector.name} Site?`}
        ctaDescription={
          p.ctaDescription ||
          "Tell us about your space and we'll send a tailored, no-obligation quote fast."
        }
      />
    </>
  );
}
