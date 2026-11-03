import type { Metadata } from "next";
import { site, seoKeywords } from "@/lib/site";
import { getPageSeo, getGlobalSeo, seoPages } from "@/lib/content";

const BASE = site.url.replace(/\/$/, "");

const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Ecoshine Solution — eco-friendly commercial cleaning across Sydney and Australia",
};

/**
 * Build the full Next.js Metadata for an editable page, reading the
 * admin-managed title/description (with baked-in defaults) plus the global
 * keyword list. Used by every page in `seoPages` via `generateMetadata`.
 */
export async function buildPageMetadata(key: string): Promise<Metadata> {
  const page = seoPages.find((p) => p.key === key);
  const [meta, global] = await Promise.all([getPageSeo(key), getGlobalSeo()]);

  const path = page?.path ?? "/";
  const url = path === "/" ? BASE : `${BASE}${path}`;

  const keywords = global.metaKeywords
    ? global.metaKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : [...seoKeywords];

  return {
    // `absolute` stops the layout's "%s | Ecoshine Solution" template from
    // double-appending the brand — our titles already include it.
    title: { absolute: meta.title },
    description: meta.description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_AU",
      url,
      siteName: site.name,
      title: meta.title,
      description: meta.description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og-image.jpg"],
    },
  };
}
