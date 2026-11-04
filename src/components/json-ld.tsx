import { states, site, services, serviceAreas } from "@/lib/site";
import { getSettings } from "@/lib/content";

/* Structured data (JSON-LD) for SEO, local/GEO ranking and AEO (answer engines
   like Google AI Overviews, ChatGPT and Perplexity read these graphs). */

const BASE = site.url.replace(/\/$/, "");
const ORG_ID = `${BASE}/#business`;

/** Renders a JSON-LD script, escaping `<` so content can never break out of
    the <script> tag. */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** The business entity — the anchor for local/GEO ranking.
    Phone, email and geo-coordinates are read from the admin-editable settings. */
export async function LocalBusinessJsonLd() {
  const settings = await getSettings();
  const sameAs = Object.values(settings.social).filter((u) => u && u !== "#");
  const phone = (settings.phoneHref || site.phoneHref).replace("tel:", "");
  const lat = Number(settings.latitude);
  const lng = Number(settings.longitude);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "CleaningService"],
        "@id": ORG_ID,
        name: settings.name || site.name,
        legalName: settings.legalName || site.legalName,
        description: settings.description || site.description,
        url: BASE,
        telephone: phone,
        email: settings.email || site.email,
        image: `${BASE}/og-image.jpg`,
        logo: `${BASE}/images/ecoshine-logo-mark.png`,
        priceRange: "$$",
        currenciesAccepted: "AUD",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Unit 5, 71-83 Asquith Street",
          addressLocality: "Silverwater",
          addressRegion: "NSW",
          postalCode: "2128",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: Number.isFinite(lat) ? lat : -33.833,
          longitude: Number.isFinite(lng) ? lng : 151.047,
        },
        areaServed: [
          ...states.map((s) => ({ "@type": "AdministrativeArea", name: s.name })),
          ...serviceAreas.map((c) => ({ "@type": "City", name: `${c}, Australia` })),
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "07:00",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "08:00",
            closes: "16:00",
          },
        ],
        knowsAbout: services.map((s) => s.keyword),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Commercial cleaning services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              serviceType: s.keyword,
            },
          })),
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "300",
        },
        ...(sameAs.length ? { sameAs } : {}),
      }}
    />
  );
}

/** Site-level WebSite entity. */
export async function WebsiteJsonLd() {
  const settings = await getSettings();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        url: BASE,
        name: settings.name || site.name,
        inLanguage: "en-AU",
        publisher: { "@id": ORG_ID },
      }}
    />
  );
}

/** Service schema for a single service page (rich results + AEO). */
export function ServiceJsonLd({
  name,
  description,
  serviceType,
  url,
}: {
  name: string;
  description: string;
  serviceType: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        serviceType,
        url,
        provider: { "@id": ORG_ID },
        areaServed: states.map((s) => ({ "@type": "AdministrativeArea", name: s.name })),
      }}
    />
  );
}

/** FAQ schema — surfaces Q&A directly in Google and feeds answer engines. */
export function FaqJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  if (faqs.length === 0) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }}
    />
  );
}

/** Breadcrumb trail for inner pages. */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url?: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          ...(it.url ? { item: it.url } : {}),
        })),
      }}
    />
  );
}
