import "server-only";
import { readContent } from "@/lib/content-store";
import {
  site,
  galleryShots,
  services as defaultServices,
  sectors as defaultSectors,
  testimonials as defaultTestimonials,
  faqs as defaultFaqs,
  advantages as defaultAdvantages,
  trustPoints as defaultTrustPoints,
  differenceStats as defaultDifferenceStats,
  howItWorks as defaultHowItWorks,
  founders as defaultFounders,
  states as defaultStates,
  seoKeywords,
  type Service,
  type Sector,
} from "@/lib/site";
import { blogPosts as defaultPosts, type BlogPost } from "@/lib/blog";

/* Admin-editable content, typed. Every getter returns the stored JSON if an
   admin has saved one, otherwise the baked-in default from the codebase - so
   the site renders fully even before the first admin edit. */

export type SiteSettings = {
  /** Business identity — shown across the site and in structured data. */
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  phone: string;
  phoneSecondary: string;
  email: string;
  website: string;
  whatsapp: string;
  address: string;
  /** Geo-coordinates of the business, used in LocalBusiness structured data. */
  latitude: string;
  longitude: string;
  mapEmbed: string;
  footerBlurb: string;
  hours: { day: string; time: string }[];
  social: { facebook: string; instagram: string; linkedin: string };
  /** Derived, always recomputed from phone. */
  phoneHref: string;
};

export type SectionHeadingContent = {
  eyebrow: string;
  title: string;
  description: string;
};

export type HomepageContent = {
  hero: {
    badge: string;
    titlePre: string;
    titleHighlight: string;
    titlePost: string;
    description: string;
    image: string;
    imageAlt: string;
    ratingValue: string;
    ratingNote: string;
  };
  services: SectionHeadingContent;
  whyChoose: {
    eyebrow: string;
    title: string;
    description: string;
    badgeValue: string;
    badgeLabel: string;
    advantages: string[];
    trustPoints: { title: string; text: string }[];
  };
  ourDifference: {
    eyebrow: string;
    title: string;
    description: string;
    overlayTitle: string;
    overlayText1: string;
    overlayText2: string;
    stats: { value: string; label: string; text: string }[];
  };
  coverage: SectionHeadingContent;
  howItWorks: {
    eyebrow: string;
    title: string;
    steps: { title: string; text: string }[];
  };
  satisfaction: {
    title: string;
    text: string;
  };
  gallery: SectionHeadingContent;
  testimonials: SectionHeadingContent & { ratingLine: string };
  faq: SectionHeadingContent;
  leadCapture: {
    title: string;
    description: string;
    buttonLabel: string;
  };
  /** Per-section visibility. Missing key = visible. Hero always shows. */
  visible: Record<string, boolean>;
};

/** Homepage sections that can be toggled on/off from the admin panel. */
export const homepageSections = [
  { key: "services", label: "Services grid" },
  { key: "whyChoose", label: "Why choose us" },
  { key: "ourDifference", label: "Our difference" },
  { key: "coverage", label: "Australia coverage map" },
  { key: "howItWorks", label: "How it works" },
  { key: "satisfaction", label: "Satisfaction guarantee band" },
  { key: "gallery", label: "Work gallery" },
  { key: "testimonials", label: "Testimonials" },
  { key: "faq", label: "FAQs" },
  { key: "leadCapture", label: "Closing call-to-action" },
] as const;

export type GalleryContent = { shots: { src: string; alt: string }[] };

export type Job = {
  id: string;
  title: string;
  location: string;
  type: string; // Full-time, Part-time, Casual
  description: string;
  active: boolean;
  postedAt: string; // ISO date
};

export type PageHeroContent = { title: string; subtitle: string };

/** Pages whose hero title/subtitle are editable from the admin panel. */
export const editablePages = [
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "sectors", label: "Sectors" },
  { key: "service-areas", label: "Service Areas" },
  { key: "gallery", label: "Gallery" },
  { key: "blog", label: "Blog" },
  { key: "careers", label: "Careers" },
  { key: "contact", label: "Contact" },
  { key: "quote", label: "Get a Quote" },
] as const;

/* ---------- SEO / metadata (editable per page) ---------- */

export type SeoMeta = { title: string; description: string };
export type SeoPage = { key: string; label: string; path: string; default: SeoMeta };

const BRAND = site.name;

/** Every indexable page whose meta title & description can be edited in admin.
    `default` is the baked-in, already-optimised value shown until an admin edits. */
export const seoPages: SeoPage[] = [
  {
    key: "home",
    label: "Homepage",
    path: "/",
    default: {
      title: `Commercial Cleaning Sydney & Australia | ${BRAND}`,
      description:
        "Eco-friendly commercial & office cleaning across Sydney and Australia. Insured, police-checked, eco-certified teams. No lock-in contracts — free quotes within 2 hours.",
    },
  },
  {
    key: "services",
    label: "Services",
    path: "/services",
    default: {
      title: `Commercial Cleaning Services Sydney | ${BRAND}`,
      description:
        "Commercial cleaning services across Sydney & Australia: office, strata, industrial, medical, childcare and builders cleans. Eco-certified, insured — free quotes.",
    },
  },
  {
    key: "sectors",
    label: "Sectors",
    path: "/sectors",
    default: {
      title: `Cleaning by Industry Sector — Sydney & Australia | ${BRAND}`,
      description:
        "Tailored, compliant cleaning programs for corporate, healthcare, education, retail, industrial and government sectors across Sydney and Australia. Eco-certified & insured.",
    },
  },
  {
    key: "service-areas",
    label: "Service Areas",
    path: "/service-areas",
    default: {
      title: `Cleaning Service Areas — Sydney, NSW, QLD, WA & TAS | ${BRAND}`,
      description:
        "Eco-friendly commercial cleaning across Sydney, New South Wales, Queensland (Brisbane), Western Australia and Tasmania, with the ACT launching in 2026.",
    },
  },
  {
    key: "about",
    label: "About",
    path: "/about",
    default: {
      title: `About Us — Sydney Commercial Cleaning Company | ${BRAND}`,
      description:
        "Ecoshine Solution is an eco-conscious, insured and police-checked commercial cleaning company serving Sydney and Australia-wide. Meet the team behind the clean.",
    },
  },
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
    default: {
      title: `Contact — Sydney Commercial Cleaners | ${BRAND}`,
      description:
        "Contact Ecoshine Solution for commercial cleaning in Sydney and Australia-wide. Call 0451 930 257, WhatsApp or message us — we reply within 2 hours during business hours.",
    },
  },
  {
    key: "quote",
    label: "Get a Quote",
    path: "/quote",
    default: {
      title: `Free Commercial Cleaning Quote — Sydney & Australia | ${BRAND}`,
      description:
        "Request a free, no-obligation commercial cleaning quote from Ecoshine Solution across Sydney and Australia. Tell us about your space — we respond within 2 hours.",
    },
  },
  {
    key: "blog",
    label: "Blog",
    path: "/blog",
    default: {
      title: `Commercial Cleaning Tips, Guides & News | ${BRAND}`,
      description:
        "Practical commercial cleaning guides from Ecoshine Solution: office cleaning schedules, eco products, childcare compliance and strata scopes for Sydney businesses.",
    },
  },
  {
    key: "gallery",
    label: "Gallery",
    path: "/gallery",
    default: {
      title: `Our Work Gallery — Ecoshine Cleaning Teams | ${BRAND}`,
      description:
        "Photos of the uniformed, eco-certified Ecoshine Solution commercial cleaning teams at work across Sydney and Australia.",
    },
  },
  {
    key: "careers",
    label: "Careers",
    path: "/careers",
    default: {
      title: `Cleaning Jobs & Careers — Sydney & Australia | ${BRAND}`,
      description:
        "Join the Ecoshine Solution team. Eco-certified, insured and police-checked commercial cleaning roles across Sydney and Australia.",
    },
  },
  {
    key: "privacy-policy",
    label: "Privacy Policy",
    path: "/privacy-policy",
    default: {
      title: `Privacy Policy | ${BRAND}`,
      description:
        "How Ecoshine Solution collects, uses and protects your personal information under the Australian Privacy Act 1988.",
    },
  },
  {
    key: "terms",
    label: "Terms & Conditions",
    path: "/terms",
    default: {
      title: `Terms & Conditions | ${BRAND}`,
      description:
        "Service delivery terms, cancellation policy, liability and payment terms for Ecoshine Solution commercial cleaning services.",
    },
  },
];

export type GlobalSeo = { metaKeywords: string };
const defaultGlobalSeo: GlobalSeo = { metaKeywords: seoKeywords.join(", ") };

type SeoStore = { global: Partial<GlobalSeo>; pages: Record<string, Partial<SeoMeta>> };

export async function getSeoStore(): Promise<SeoStore> {
  return readContent<SeoStore>("seo", { global: {}, pages: {} });
}

/** Effective meta for a page — stored override or the baked-in default. */
export async function getPageSeo(key: string): Promise<SeoMeta> {
  const page = seoPages.find((p) => p.key === key);
  const fallback = page?.default ?? { title: BRAND, description: "" };
  const store = await getSeoStore();
  const stored = store.pages[key] ?? {};
  return {
    title: stored.title?.trim() || fallback.title,
    description: stored.description?.trim() || fallback.description,
  };
}

export async function getGlobalSeo(): Promise<GlobalSeo> {
  const store = await getSeoStore();
  return { ...defaultGlobalSeo, ...store.global };
}

/* ---------- legal pages (Privacy & Terms) ---------- */

export type LegalSection = { heading: string; body: string };
export type LegalPage = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
  /** Append an auto-generated "Contact us" block built from Settings. */
  showContact: boolean;
};

/** Which legal pages exist, for the admin editor. */
export const legalPages = [
  { key: "privacy", label: "Privacy Policy", path: "/privacy-policy" },
  { key: "terms", label: "Terms & Conditions", path: "/terms" },
] as const;

export type LegalKey = (typeof legalPages)[number]["key"];

/* `{business}` in any text is replaced with the legal name at render time, so
   renaming the company updates the legal copy too. */
const defaultLegal: Record<LegalKey, LegalPage> = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How {business} collects, uses and protects your personal information.",
    lastUpdated: "1 July 2026",
    intro:
      '{business} ("we", "us", "our") is committed to protecting your privacy. This policy explains how we handle your personal information in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).',
    showContact: true,
    sections: [
      {
        heading: "Information we collect",
        body: "We may collect the following personal information:\n\n- Your name, email address, phone number and postal or site address.\n- Company or organisation details when you enquire on behalf of a business.\n- Details of the cleaning services you request or receive.\n- Information you provide through our contact form, quote requests, phone calls or emails.\n- Technical data such as your IP address and browser type when you visit our website.",
      },
      {
        heading: "How we use your information",
        body: "We use your personal information to:\n\n- Respond to your enquiries and provide quotes.\n- Schedule, deliver and manage our cleaning services.\n- Process payments and maintain our business records.\n- Communicate with you about your bookings and our services.\n- Improve our website, services and customer experience.\n- Comply with our legal and regulatory obligations.",
      },
      {
        heading: "Disclosure of your information",
        body: "We do not sell your personal information. We may share it with trusted service providers who help us operate our business (such as payment processors and IT providers), or where required or authorised by law. Any third parties we engage are required to protect your information consistent with this policy.",
      },
      {
        heading: "Data security",
        body: "We take reasonable steps to protect your personal information from misuse, loss, unauthorised access, modification or disclosure. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
      },
      {
        heading: "Access and correction",
        body: "You may request access to the personal information we hold about you, or ask us to correct it if it is inaccurate. To make a request, or if you have a privacy complaint, please contact us using the details below and we will respond within a reasonable time.",
      },
      {
        heading: "Cookies",
        body: "Our website may use cookies and similar technologies to remember your preferences and understand how the site is used. You can disable cookies in your browser settings, though some parts of the site may not function as intended.",
      },
      {
        heading: "Changes to this policy",
        body: 'We may update this policy from time to time. The latest version will always be available on this page, with the "last updated" date shown above.',
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    subtitle: "The terms that apply when you book cleaning services with {business}.",
    lastUpdated: "1 July 2026",
    intro:
      'These Terms & Conditions govern the cleaning services provided by {business} ("we", "us", "our"). By booking or using our services, you agree to these terms.',
    showContact: true,
    sections: [
      {
        heading: "1. Quotes and bookings",
        body: "Quotes are provided free of charge and are based on the information you give us about the site and the work required. If the actual scope differs materially from what was described, we may revise the quote before or during the job. A booking is confirmed once we have agreed the scope, price and schedule with you.",
      },
      {
        heading: "2. Pricing and payment",
        body: "- Prices are quoted in Australian dollars and are inclusive of GST where applicable.\n- Invoices are payable by the due date stated on the invoice.\n- For ongoing services, pricing may be reviewed periodically with reasonable notice to you.\n- Late payments may incur reasonable recovery costs.",
      },
      {
        heading: "3. No lock-in contracts",
        body: "We operate without lock-in contracts. You may start, pause or cancel ongoing services by giving us reasonable notice, as agreed at the time of booking.",
      },
      {
        heading: "4. Cancellations and rescheduling",
        body: "We ask for at least 24 hours' notice to cancel or reschedule a booked clean. Cancellations made with less notice, or where our team is unable to access the site at the agreed time, may incur a fee to cover the reserved labour.",
      },
      {
        heading: "5. Access and site conditions",
        body: "You agree to provide safe and timely access to the site and to advise us of any hazards, security requirements or special instructions. We are not responsible for delays or incomplete work caused by a lack of access, utilities or unsafe conditions beyond our control.",
      },
      {
        heading: "6. Our satisfaction guarantee",
        body: "If you are not satisfied with a clean, let us know within 24 hours and we will return to re-clean the affected areas at no additional cost. This guarantee covers the agreed scope of work.",
      },
      {
        heading: "7. Insurance and liability",
        body: "We carry public liability insurance and our staff are police-checked. To the extent permitted by law, our liability is limited to re-performing the services or the cost of having the services re-performed. Nothing in these terms excludes any rights you have under the Australian Consumer Law.",
      },
      {
        heading: "8. Damage and claims",
        body: "Any claim for loss or damage must be reported to us in writing within 48 hours of the service so we can investigate promptly. We are not liable for pre-existing damage or for items that are inherently fragile and were not disclosed to us.",
      },
      {
        heading: "9. Privacy",
        body: "We handle your personal information in accordance with our Privacy Policy.",
      },
      {
        heading: "10. Changes to these terms",
        body: 'We may update these terms from time to time. The current version will always be available on this page, with the "last updated" date shown above.',
      },
    ],
  },
};

export async function getLegalPage(key: LegalKey): Promise<LegalPage> {
  const store = await readContent<Partial<Record<LegalKey, LegalPage>>>("legal", {});
  return store[key] ?? defaultLegal[key];
}

const defaultSettings: Omit<SiteSettings, "phoneHref"> = {
  name: site.name,
  legalName: site.legalName,
  tagline: site.tagline,
  description: site.description,
  phone: site.phone,
  phoneSecondary: site.phoneSecondary,
  email: site.email,
  website: site.url,
  whatsapp: site.whatsapp,
  address: site.address,
  latitude: "-33.833",
  longitude: "151.047",
  mapEmbed: "",
  footerBlurb: `${site.tagline}. Eco-certified, fully insured and police-checked cleaning you can trust.`,
  hours: [...site.hours],
  social: { ...site.social },
};

const defaultHomepage: HomepageContent = {
  hero: {
    badge: "Eco-certified, insured and police-checked",
    titlePre: "Eco-Friendly",
    titleHighlight: "Commercial Cleaning",
    titlePost: "Across Australia",
    description:
      "From childcare and healthcare to hospitality, offices and government sites, our trusted local teams deliver eco-certified cleans using plant-based products. Now servicing New South Wales, Queensland, Western Australia and Tasmania, with the ACT launching 1 July 2026.",
    image: "/images/hero-window-cleaning-sydney.jpg",
    imageAlt: "Ecoshine cleaner delivering eco-friendly commercial cleaning",
    ratingValue: "4.9 out of 5",
    ratingNote: "from 300+ reviews",
  },
  services: {
    eyebrow: "What we do",
    title: "Cleaning services for every sector",
    description:
      "From childcare and healthcare to hospitality, industrial and government sites. One reliable team, eco-certified products, and our satisfaction guarantee on every job.",
  },
  whyChoose: {
    eyebrow: "Why Ecoshine",
    title: "The cleaning team Australian businesses actually keep",
    description:
      "Plenty of cleaners promise the world and disappear after the first job. We pair genuine eco-credentials with the reliability and professionalism that keep clients with us for years.",
    badgeValue: "8+",
    badgeLabel: "years cleaning",
    advantages: [...defaultAdvantages],
    trustPoints: defaultTrustPoints.map((p) => ({ title: p.title, text: p.text })),
  },
  ourDifference: {
    eyebrow: "Our Difference",
    title: "Reliable Cleaning, Backed by Real Accountability",
    description:
      "From eco-certified products to insured, police-checked teams, every Ecoshine clean is backed by clear communication and a satisfaction guarantee you can count on.",
    overlayTitle: "Consistent Service You Can Rely On",
    overlayText1:
      "Every site is managed by a dedicated local team, so you always know who is cleaning your space and when. Clear scheduling and direct communication mean nothing falls through the cracks.",
    overlayText2:
      "Backed by our satisfaction guarantee, if a clean ever falls short we will return and put it right at no extra cost, no questions asked.",
    stats: [...defaultDifferenceStats],
  },
  coverage: {
    eyebrow: "Where we clean",
    title: "Eco cleaning across five states and territories",
    description:
      "From our New South Wales home base, Ecoshine now serves Queensland, Western Australia and Tasmania, with the ACT joining on 1 July 2026. Tap a location to see the cities we cover.",
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "A spotless space in three simple steps",
    steps: defaultHowItWorks.map((s) => ({ title: s.title, text: s.text })),
  },
  satisfaction: {
    title: "Satisfaction Guaranteed",
    text: "We're so confident that your building will be cleaned to the standard you deserve every time that we'll organise a follow-up clean if you're not 100% happy with our service.",
  },
  gallery: {
    eyebrow: "Our work",
    title: "Real teams, real results",
    description:
      "A look at the uniformed, professional crews who turn up for our clients every day. Click any photo for a closer look.",
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "Trusted right across Australia",
    description:
      "Real feedback from the businesses and families we clean for every week.",
    ratingLine: "4.9 out of 5 from 300+ reviews",
  },
  faq: {
    eyebrow: "FAQs",
    title: "Frequently asked questions",
    description:
      "Everything you need to know before booking. Can't find your answer? Just contact us.",
  },
  leadCapture: {
    title: "Ready for Your Next Eco-Friendly Clean?",
    description:
      "Great cleaning should feel invisible, reliable, and always on time. Ecoshine's local teams use eco-certified products and back every job with our satisfaction guarantee. Book your free, no-obligation quote and see the difference for yourself.",
    buttonLabel: "Get a Quote",
  },
  visible: {},
};

export async function getSettings(): Promise<SiteSettings> {
  const stored = await readContent("settings", defaultSettings);
  const phone = stored.phone || defaultSettings.phone;
  return {
    ...defaultSettings,
    ...stored,
    phone,
    website: stored.website || defaultSettings.website,
    phoneHref: `tel:+61${phone.replace(/\D/g, "").replace(/^0/, "")}`,
  };
}

export async function getHomepage(): Promise<HomepageContent> {
  const stored = await readContent<Partial<HomepageContent>>("homepage", defaultHomepage);
  // Shallow-merge each section over its default so a stored partial (or an old
  // hero-only file) still renders every section fully.
  return {
    hero: { ...defaultHomepage.hero, ...stored.hero },
    services: { ...defaultHomepage.services, ...stored.services },
    whyChoose: { ...defaultHomepage.whyChoose, ...stored.whyChoose },
    ourDifference: { ...defaultHomepage.ourDifference, ...stored.ourDifference },
    coverage: { ...defaultHomepage.coverage, ...stored.coverage },
    howItWorks: { ...defaultHomepage.howItWorks, ...stored.howItWorks },
    satisfaction: { ...defaultHomepage.satisfaction, ...stored.satisfaction },
    gallery: { ...defaultHomepage.gallery, ...stored.gallery },
    testimonials: { ...defaultHomepage.testimonials, ...stored.testimonials },
    faq: { ...defaultHomepage.faq, ...stored.faq },
    leadCapture: { ...defaultHomepage.leadCapture, ...stored.leadCapture },
    visible: { ...defaultHomepage.visible, ...stored.visible },
  };
}

export async function getGallery(): Promise<GalleryContent> {
  return readContent("gallery", { shots: [...galleryShots] });
}

export async function getJobs(): Promise<Job[]> {
  const { jobs } = await readContent<{ jobs: Job[] }>("jobs", { jobs: [] });
  return jobs;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { posts } = await readContent<{ posts: BlogPost[] }>("blog", {
    posts: defaultPosts,
  });
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getPageHero(
  key: string,
  fallback: PageHeroContent
): Promise<PageHeroContent> {
  const { heroes } = await readContent<{ heroes: Record<string, PageHeroContent> }>(
    "pages",
    { heroes: {} }
  );
  return heroes[key] ?? fallback;
}

export async function getAllPageHeroes(): Promise<Record<string, PageHeroContent>> {
  const { heroes } = await readContent<{ heroes: Record<string, PageHeroContent> }>(
    "pages",
    { heroes: {} }
  );
  return heroes;
}

/* ---------- about page ---------- */

export type Founder = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string; // "" = show initials instead
  linkedin: string;
};

export type AboutContent = {
  storyEyebrow: string;
  storyTitle: string;
  storyBody1: string;
  storyBody2: string;
  storyImage: string;
  storyImageAlt: string;
  valuesEyebrow: string;
  valuesTitle: string;
  foundersEyebrow: string;
  foundersTitle: string;
  founders: Founder[];
};

const defaultAbout: AboutContent = {
  storyEyebrow: "Our story",
  storyTitle: "Cleaning done properly, the eco-friendly way",
  storyBody1:
    "Ecoshine Solution was founded on a belief that professional cleaning and caring for the environment should go hand in hand. What started as a small Sydney team has grown into a trusted operation servicing New South Wales, Queensland, Western Australia and Tasmania, with the ACT joining on 1 July 2026.",
  storyBody2:
    "Across childcare, healthcare, hospitality, industrial, community and government sites, we bring the same promise to every job: eco-certified products, insured and police-checked staff, and a finish we stand behind with our satisfaction guarantee.",
  storyImage: "/images/ecoshine-cleaning-team.jpg",
  storyImageAlt:
    "The Ecoshine Solution cleaning team in uniform by the Sydney Harbour Bridge",
  valuesEyebrow: "What we stand for",
  valuesTitle: "Values our clients can count on",
  foundersEyebrow: "Leadership",
  foundersTitle: "A Word From Our Founders",
  founders: defaultFounders.map((f, i) => ({
    id: `founder-${i + 1}`,
    name: f.name,
    role: f.role,
    quote: f.quote,
    image: f.image ?? "",
    linkedin: f.linkedin,
  })),
};

export async function getAbout(): Promise<AboutContent> {
  const stored = await readContent<Partial<AboutContent>>("about", {});
  return {
    ...defaultAbout,
    ...stored,
    founders: Array.isArray(stored.founders) ? stored.founders : defaultAbout.founders,
  };
}

/* ---------- service areas (the /service-areas page) ---------- */

export type ServiceArea = {
  id: string;
  name: string;
  status: "active" | "launching";
  launchDate: string; // shown when status is "launching"
  isHq: boolean;
  tagline: string;
  cities: string[];
};

/* Seeded from the code-defined states. Note: the homepage hex coverage map
   stays code-driven (it needs fixed map geometry); this drives the editable
   /service-areas page only. */
const defaultServiceAreas: ServiceArea[] = defaultStates.map((s) => ({
  id: s.code.toLowerCase(),
  name: s.name,
  status: s.status,
  launchDate: s.launchDate ?? "",
  isHq: s.isHq ?? false,
  tagline: s.tagline,
  cities: [...s.cities],
}));

export async function getServiceAreas(): Promise<ServiceArea[]> {
  const { items } = await readContent<{ items: ServiceArea[] }>("service-areas", {
    items: defaultServiceAreas,
  });
  return items;
}

/* ---------- services & sectors (text/image overrides over code defaults) ---------- */

/** Editable fields of a service; slug, category and icon stay code-defined. */
export type ServiceOverride = {
  title?: string;
  short?: string;
  blurb?: string;
  image?: string;
  imageAlt?: string;
};

export type SectorOverride = {
  name?: string;
  blurb?: string;
  image?: string;
  imageAlt?: string;
};

/** Services/sectors are fully serializable now (icon is a string key), so they
    can be passed straight to client components. */
export type PlainService = Service;
export type PlainSector = Sector;

/* Stored shape: once an admin performs any create/update/delete we persist the
   full list under `items`. Before that (or migrating from the old override-only
   files) we seed from the code defaults and apply any legacy overrides. */

export async function getServices(): Promise<Service[]> {
  const stored = await readContent<{
    items?: Service[];
    overrides?: Record<string, ServiceOverride>;
  }>("services", {});
  if (Array.isArray(stored.items)) return stored.items;

  const overrides = stored.overrides ?? {};
  return defaultServices.map((s) => {
    const o = overrides[s.slug];
    if (!o) return s;
    return {
      ...s,
      title: o.title?.trim() || s.title,
      short: o.short?.trim() || s.short,
      blurb: o.blurb?.trim() || s.blurb,
      image: o.image?.trim() || s.image,
      imageAlt: o.imageAlt?.trim() || s.imageAlt,
    };
  });
}

export async function getSectors(): Promise<Sector[]> {
  const stored = await readContent<{
    items?: Sector[];
    overrides?: Record<string, SectorOverride>;
  }>("sectors", {});
  if (Array.isArray(stored.items)) return stored.items;

  const overrides = stored.overrides ?? {};
  return defaultSectors.map((s) => {
    const o = overrides[s.slug];
    if (!o) return s;
    return {
      ...s,
      name: o.name?.trim() || s.name,
      blurb: o.blurb?.trim() || s.blurb,
      image: o.image?.trim() || s.image,
      imageAlt: o.imageAlt?.trim() || s.imageAlt,
    };
  });
}

/* ---------- testimonials ---------- */

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  service: string;
  rating: number;
  text: string;
};

const seededTestimonials: Testimonial[] = defaultTestimonials.map((t, i) => ({
  id: `t-${i + 1}`,
  ...t,
}));

export async function getTestimonials(): Promise<Testimonial[]> {
  const { items } = await readContent<{ items: Testimonial[] }>("testimonials", {
    items: seededTestimonials,
  });
  return items;
}

/* ---------- FAQs ---------- */

export type FaqItem = { id: string; question: string; answer: string };

const seededFaqs: FaqItem[] = defaultFaqs.map((f, i) => ({ id: `faq-${i + 1}`, ...f }));

export async function getFaqs(): Promise<FaqItem[]> {
  const { items } = await readContent<{ items: FaqItem[] }>("faqs", { items: seededFaqs });
  return items;
}

/* ---------- trusted-by logos ---------- */

export type TrustedLogo = { src: string; name: string };

const defaultTrustedLogos: TrustedLogo[] = [
  { name: "Progress Facilities Management", src: "/images/logos/progress-fm.png" },
  { name: "Real Health Medical Centre", src: "/images/logos/real-health.png" },
  { name: "Sydney City College of Management", src: "/images/logos/sydney-city-college.png" },
  { name: "White Spot Group", src: "/images/logos/white-spot-group.png" },
  { name: "SAJO", src: "/images/logos/sajo.png" },
];

export async function getTrustedLogos(): Promise<TrustedLogo[]> {
  const { logos } = await readContent<{ logos: TrustedLogo[] }>("trusted", {
    logos: defaultTrustedLogos,
  });
  return logos;
}

/** Blog categories are sourced from live service and sector names. */
export async function getBlogCategories(): Promise<string[]> {
  const [services, sectors] = await Promise.all([getServices(), getSectors()]);
  const set = new Set<string>();
  for (const s of services) set.add(s.short);
  for (const s of sectors) set.add(s.name);
  return [...set];
}

/* ---------- form submissions (contact + quote requests) ---------- */

export type Submission = {
  id: string;
  kind: "contact" | "quote";
  createdAt: string; // ISO
  read: boolean;
  name: string;
  email: string;
  phone: string;
  /** Free-form label describing what they need (subject or service). */
  subject: string;
  message: string;
  /** Extra structured fields, e.g. company, state, suburb. */
  meta: Record<string, string>;
};

export async function getSubmissions(): Promise<Submission[]> {
  const { items } = await readContent<{ items: Submission[] }>("submissions", { items: [] });
  // Newest first.
  return [...items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
