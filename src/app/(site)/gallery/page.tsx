import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { GalleryGrid } from "@/components/gallery-grid";
import { getGallery, getPageHero } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("gallery");
}

export default async function GalleryPage() {
  const [gallery, hero] = await Promise.all([
    getGallery(),
    getPageHero("gallery", {
      title: "Gallery",
      subtitle:
        "A look at the uniformed, professional crews who turn up for our clients every day. Click any photo for a closer look.",
    }),
  ]);

  return (
    <>
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <section className="container-page py-16">
        <GalleryGrid
          shots={gallery.shots}
          rowHeight="auto-rows-[200px] sm:auto-rows-[220px]"
        />
      </section>
    </>
  );
}
