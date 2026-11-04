"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminSession,
  destroyAdminSession,
  requireAdmin,
  verifyCredentials,
} from "@/lib/admin-auth";
import { readContent, writeContent } from "@/lib/content-store";
import { firebaseEnabled, storageEnabled, getBucket } from "@/lib/firebase";
import {
  getBlogPosts,
  getGallery,
  getHomepage,
  getJobs,
  getServices,
  getSectors,
  getSettings,
  getTestimonials,
  getFaqs,
  getTrustedLogos,
  getSubmissions,
  getAbout,
  getServiceAreas,
  editablePages,
  homepageSections,
  seoPages,
  legalPages,
  footerCompanyLinks,
  footerLegalLinks,
  navTopDefaults,
  navFooterHeadingDefaults,
  type LegalKey,
  type LegalPage,
  type LegalSection,
  type Job,
  type PageHeroContent,
  type Testimonial,
  type FaqItem,
  type Founder,
  type ServiceArea,
} from "@/lib/content";
import {
  serviceCategories,
  overviewLinks,
  exploreLinks,
  type Service,
  type Sector,
  type ServiceCategory,
  type DetailPageContent,
} from "@/lib/site";
import { iconRegistry, DEFAULT_ICON_KEY } from "@/lib/icons";
import {
  required,
  isEmail,
  isUrl,
  isAuPhone,
  isIsoDate,
  isRating,
  maxLen,
  validateAll,
} from "@/lib/validate";
import { textToBlocks } from "@/lib/blog-format";
import type { BlogPost } from "@/lib/blog";

/* ---------- helpers ---------- */

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/* Uploads work on local/VPS (filesystem) and on Firebase once a Storage bucket
   is configured. On Firebase without a bucket they're refused (nothing can be
   written to Vercel's read-only disk) — the existing image is kept. */
const uploadsEnabled = !firebaseEnabled || storageEnabled;
const UPLOADS_DISABLED_MSG =
  "Image uploads are paused right now — image storage will be switched on soon. Remove the selected image and save again; the current image is kept.";

/** Returns an error string when the file is not an acceptable image. */
function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES[file.type]) {
    return `unsupported image type (use JPG, PNG, WebP or AVIF)`;
  }
  if (file.size > MAX_UPLOAD_BYTES) return "image is larger than 8MB";
  return null;
}

/** Redirects back to `path` with a readable error message. */
function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

/** Saves an uploaded image and returns its public URL. When Firebase is
    configured the file goes to Firebase Storage (required on Vercel's
    read-only disk); otherwise it is written to public/uploads for local dev or
    a VPS. Call validateImage() first. */
async function saveUpload(file: File): Promise<string> {
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) throw new Error(`Unsupported image type: ${file.type || "unknown"}`);
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Image is larger than 8MB.");

  const base = path
    .basename(file.name, path.extname(file.name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";
  const name = `${Date.now()}-${base}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (storageEnabled) {
    const bucket = getBucket();
    const objectPath = `uploads/${name}`;
    const ref = bucket.file(objectPath);
    await ref.save(buffer, {
      contentType: file.type,
      resumable: false,
      metadata: { cacheControl: "public, max-age=31536000, immutable" },
    });
    // Per-object makePublic() works with fine-grained ACLs but throws under
    // uniform bucket-level access (the modern default). Treat it as best-effort
    // — under UBLA the bucket is made public at the bucket level instead.
    try {
      await ref.makePublic();
    } catch {
      /* UBLA bucket — public read is granted via bucket IAM (see setup). */
    }
    return `https://storage.googleapis.com/${bucket.name}/${objectPath}`;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buffer);
  return `/uploads/${name}`;
}

function field(formData: FormData, name: string): string {
  const v = formData.get(name);
  return typeof v === "string" ? v.trim() : "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function dateLabelFor(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

/** Blow the whole page cache; simplest correct choice for a small site. */
function revalidateSite() {
  revalidatePath("/", "layout");
}

/* ---------- auth ---------- */

export async function loginAction(formData: FormData) {
  const email = field(formData, "email");
  const password = typeof formData.get("password") === "string" ? (formData.get("password") as string) : "";
  if (!verifyCredentials(email, password)) redirect("/ecoshine_admin_panel/login?error=1");
  await createAdminSession();
  redirect("/ecoshine_admin_panel");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/ecoshine_admin_panel/login");
}

/* ---------- homepage ---------- */

export async function saveHomepageAction(formData: FormData) {
  await requireAdmin();
  const current = await getHomepage();

  const err = validateAll(
    required(field(formData, "titlePre"), "Heading (first part)"),
    required(field(formData, "titleHighlight"), "Heading (highlighted part)"),
    required(field(formData, "description"), "Description"),
    maxLen(field(formData, "badge"), 80, "Badge text"),
    required(field(formData, "services-title"), "Services section title"),
    required(field(formData, "whyChoose-title"), "Why-choose title"),
    required(field(formData, "ourDifference-title"), "Our-difference title"),
    required(field(formData, "coverage-title"), "Coverage title"),
    required(field(formData, "howItWorks-title"), "How-it-works title"),
    required(field(formData, "satisfaction-title"), "Satisfaction title"),
    required(field(formData, "gallery-title"), "Gallery title"),
    required(field(formData, "testimonials-title"), "Testimonials title"),
    required(field(formData, "faq-title"), "FAQ title"),
    required(field(formData, "leadCapture-title"), "Closing CTA title")
  );
  if (err) fail("/ecoshine_admin_panel/homepage", err);

  let image = field(formData, "image") || current.hero.image;
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    if (!uploadsEnabled) fail("/ecoshine_admin_panel/homepage", UPLOADS_DISABLED_MSG);
    const imgErr = validateImage(file);
    if (imgErr) fail("/ecoshine_admin_panel/homepage", `Hero image ${imgErr}`);
    image = await saveUpload(file);
  }

  // Fixed-length list editors: read indexed fields for as many rows as the
  // current content has, so counts stay stable and every value is editable.
  const heading = (key: string, cur: { eyebrow: string; title: string; description: string }) => ({
    eyebrow: field(formData, `${key}-eyebrow`) || cur.eyebrow,
    title: field(formData, `${key}-title`) || cur.title,
    description: field(formData, `${key}-description`) || cur.description,
  });

  const advantages = current.whyChoose.advantages.map(
    (a, i) => field(formData, `advantage-${i}`) || a
  );
  const trustPoints = current.whyChoose.trustPoints.map((p, i) => ({
    title: field(formData, `trust-title-${i}`) || p.title,
    text: field(formData, `trust-text-${i}`) || p.text,
  }));
  const stats = current.ourDifference.stats.map((s, i) => ({
    value: field(formData, `stat-value-${i}`) || s.value,
    label: field(formData, `stat-label-${i}`) || s.label,
    text: field(formData, `stat-text-${i}`) || s.text,
  }));
  const steps = current.howItWorks.steps.map((s, i) => ({
    title: field(formData, `step-title-${i}`) || s.title,
    text: field(formData, `step-text-${i}`) || s.text,
  }));

  const visible: Record<string, boolean> = {};
  for (const s of homepageSections) {
    visible[s.key] = formData.get(`visible-${s.key}`) === "on";
  }

  await writeContent("homepage", {
    hero: {
      badge: field(formData, "badge"),
      titlePre: field(formData, "titlePre") || current.hero.titlePre,
      titleHighlight: field(formData, "titleHighlight") || current.hero.titleHighlight,
      titlePost: field(formData, "titlePost") || current.hero.titlePost,
      description: field(formData, "description") || current.hero.description,
      image,
      imageAlt: field(formData, "imageAlt") || current.hero.imageAlt,
      ratingValue: field(formData, "ratingValue") || current.hero.ratingValue,
      ratingNote: field(formData, "ratingNote") || current.hero.ratingNote,
    },
    services: heading("services", current.services),
    whyChoose: {
      eyebrow: field(formData, "whyChoose-eyebrow") || current.whyChoose.eyebrow,
      title: field(formData, "whyChoose-title") || current.whyChoose.title,
      description: field(formData, "whyChoose-description") || current.whyChoose.description,
      badgeValue: field(formData, "whyChoose-badgeValue") || current.whyChoose.badgeValue,
      badgeLabel: field(formData, "whyChoose-badgeLabel") || current.whyChoose.badgeLabel,
      advantages,
      trustPoints,
    },
    ourDifference: {
      eyebrow: field(formData, "ourDifference-eyebrow") || current.ourDifference.eyebrow,
      title: field(formData, "ourDifference-title") || current.ourDifference.title,
      description: field(formData, "ourDifference-description") || current.ourDifference.description,
      overlayTitle: field(formData, "ourDifference-overlayTitle") || current.ourDifference.overlayTitle,
      overlayText1: field(formData, "ourDifference-overlayText1") || current.ourDifference.overlayText1,
      overlayText2: field(formData, "ourDifference-overlayText2") || current.ourDifference.overlayText2,
      stats,
    },
    coverage: heading("coverage", current.coverage),
    howItWorks: {
      eyebrow: field(formData, "howItWorks-eyebrow") || current.howItWorks.eyebrow,
      title: field(formData, "howItWorks-title") || current.howItWorks.title,
      steps,
    },
    satisfaction: {
      title: field(formData, "satisfaction-title") || current.satisfaction.title,
      text: field(formData, "satisfaction-text") || current.satisfaction.text,
    },
    gallery: heading("gallery", current.gallery),
    testimonials: {
      eyebrow: field(formData, "testimonials-eyebrow") || current.testimonials.eyebrow,
      title: field(formData, "testimonials-title") || current.testimonials.title,
      description: field(formData, "testimonials-description") || current.testimonials.description,
      ratingLine: field(formData, "testimonials-ratingLine"),
    },
    faq: heading("faq", current.faq),
    leadCapture: {
      title: field(formData, "leadCapture-title") || current.leadCapture.title,
      description: field(formData, "leadCapture-description") || current.leadCapture.description,
      buttonLabel: field(formData, "leadCapture-buttonLabel") || current.leadCapture.buttonLabel,
    },
    visible,
  });
  revalidateSite();
  redirect("/ecoshine_admin_panel/homepage?saved=1");
}

/* ---------- page heroes ---------- */

export async function savePagesAction(formData: FormData) {
  await requireAdmin();
  const heroes: Record<string, PageHeroContent> = {};
  for (const page of editablePages) {
    const title = field(formData, `${page.key}-title`);
    const subtitle = field(formData, `${page.key}-subtitle`);
    if (title || subtitle) heroes[page.key] = { title, subtitle };
  }
  await writeContent("pages", { heroes });
  revalidateSite();
  redirect("/ecoshine_admin_panel/pages?saved=1");
}

/* ---------- about page ---------- */

export async function saveAboutAction(formData: FormData) {
  await requireAdmin();
  const current = await getAbout();

  const err = validateAll(
    required(field(formData, "storyTitle"), "Story title"),
    required(field(formData, "storyBody1"), "Story paragraph"),
    required(field(formData, "valuesTitle"), "Values title"),
    required(field(formData, "foundersTitle"), "Founders title")
  );
  if (err) fail("/ecoshine_admin_panel/about", err);

  let storyImage = field(formData, "storyImage") || current.storyImage;
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    if (!uploadsEnabled) fail("/ecoshine_admin_panel/about", UPLOADS_DISABLED_MSG);
    const imgErr = validateImage(file);
    if (imgErr) fail("/ecoshine_admin_panel/about", `Story image ${imgErr}`);
    storyImage = await saveUpload(file);
  }

  await writeContent("about", {
    ...current,
    storyEyebrow: field(formData, "storyEyebrow") || current.storyEyebrow,
    storyTitle: field(formData, "storyTitle"),
    storyBody1: field(formData, "storyBody1"),
    storyBody2: field(formData, "storyBody2"),
    storyImage,
    storyImageAlt: field(formData, "storyImageAlt") || current.storyImageAlt,
    valuesEyebrow: field(formData, "valuesEyebrow") || current.valuesEyebrow,
    valuesTitle: field(formData, "valuesTitle"),
    foundersEyebrow: field(formData, "foundersEyebrow") || current.foundersEyebrow,
    foundersTitle: field(formData, "foundersTitle"),
  });
  revalidateSite();
  redirect("/ecoshine_admin_panel/about?saved=1");
}

export async function saveFounderAction(formData: FormData) {
  await requireAdmin();
  const current = await getAbout();
  const id = field(formData, "id") || `founder-${Date.now()}`;
  const existing = current.founders.find((f) => f.id === id);

  const err = validateAll(
    required(field(formData, "name"), "Name"),
    maxLen(field(formData, "name"), 80, "Name"),
    required(field(formData, "role"), "Role"),
    required(field(formData, "quote"), "Quote"),
    maxLen(field(formData, "quote"), 600, "Quote"),
    isUrl(field(formData, "linkedin"), "LinkedIn URL")
  );
  if (err) fail("/ecoshine_admin_panel/about", err);

  let image = field(formData, "image") || existing?.image || "";
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    if (!uploadsEnabled) fail("/ecoshine_admin_panel/about", UPLOADS_DISABLED_MSG);
    const imgErr = validateImage(file);
    if (imgErr) fail("/ecoshine_admin_panel/about", `Portrait ${imgErr}`);
    image = await saveUpload(file);
  }

  const founder: Founder = {
    id,
    name: field(formData, "name"),
    role: field(formData, "role"),
    quote: field(formData, "quote"),
    image,
    linkedin: field(formData, "linkedin") || "#",
  };

  const next = existing
    ? current.founders.map((f) => (f.id === id ? founder : f))
    : [...current.founders, founder];
  await writeContent("about", { ...current, founders: next });
  revalidateSite();
  redirect("/ecoshine_admin_panel/about?saved=1");
}

export async function deleteFounderAction(formData: FormData) {
  await requireAdmin();
  const current = await getAbout();
  const id = field(formData, "id");
  const target = current.founders.find((f) => f.id === id);
  await writeContent("about", {
    ...current,
    founders: current.founders.filter((f) => f.id !== id),
  });
  if (target?.image.startsWith("/uploads/")) {
    await fs.unlink(path.join(process.cwd(), "public", target.image)).catch(() => {});
  }
  revalidateSite();
  redirect("/ecoshine_admin_panel/about?saved=1");
}

/* ---------- service areas ---------- */

/** Parse a cities textarea (comma- or newline-separated) into a clean list. */
function parseCities(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((c) => c.trim())
    .filter(Boolean)
    .slice(0, 40);
}

export async function saveServiceAreaAction(formData: FormData) {
  await requireAdmin();
  const items = await getServiceAreas();
  const id = field(formData, "id") || `area-${Date.now()}`;
  const existing = items.find((a) => a.id === id);

  const err = validateAll(
    required(field(formData, "name"), "Area name"),
    maxLen(field(formData, "name"), 80, "Area name"),
    required(field(formData, "tagline"), "Tagline"),
    maxLen(field(formData, "tagline"), 200, "Tagline")
  );
  if (err) fail("/ecoshine_admin_panel/service-areas", err);

  const status = field(formData, "status") === "launching" ? "launching" : "active";
  const area: ServiceArea = {
    id,
    name: field(formData, "name"),
    status,
    launchDate: status === "launching" ? field(formData, "launchDate") : "",
    isHq: formData.get("isHq") === "on",
    tagline: field(formData, "tagline"),
    cities: parseCities(field(formData, "cities")),
  };

  const next = existing ? items.map((a) => (a.id === id ? area : a)) : [...items, area];
  await writeContent("service-areas", { items: next });
  revalidateSite();
  redirect("/ecoshine_admin_panel/service-areas?saved=1");
}

export async function deleteServiceAreaAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  const items = await getServiceAreas();
  await writeContent("service-areas", { items: items.filter((a) => a.id !== id) });
  revalidateSite();
  redirect("/ecoshine_admin_panel/service-areas?saved=1");
}

/* ---------- settings ---------- */

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const current = await getSettings();

  const err = validateAll(
    required(field(formData, "name"), "Business name"),
    required(field(formData, "legalName"), "Legal name"),
    required(field(formData, "phone"), "Phone"),
    isAuPhone(field(formData, "phone"), "Phone"),
    isAuPhone(field(formData, "phoneSecondary"), "Secondary phone"),
    required(field(formData, "email"), "Email"),
    isEmail(field(formData, "email"), "Email"),
    isUrl(field(formData, "website"), "Website URL"),
    isUrl(field(formData, "whatsapp"), "WhatsApp link"),
    required(field(formData, "address"), "Address"),
    isUrl(field(formData, "facebook"), "Facebook URL"),
    isUrl(field(formData, "instagram"), "Instagram URL"),
    isUrl(field(formData, "linkedin"), "LinkedIn URL")
  );
  if (err) fail("/ecoshine_admin_panel/settings", err);

  // Geo-coordinates (optional): blank keeps the current value. Validate range.
  const latRaw = field(formData, "latitude");
  const lngRaw = field(formData, "longitude");
  const lat = latRaw === "" ? current.latitude : latRaw;
  const lng = lngRaw === "" ? current.longitude : lngRaw;
  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (!Number.isFinite(latNum) || latNum < -90 || latNum > 90) {
    fail("/ecoshine_admin_panel/settings", "Latitude must be a number between -90 and 90");
  }
  if (!Number.isFinite(lngNum) || lngNum < -180 || lngNum > 180) {
    fail("/ecoshine_admin_panel/settings", "Longitude must be a number between -180 and 180");
  }

  const hours = [0, 1, 2].map((i) => ({
    day: field(formData, `hours-day-${i}`) || current.hours[i]?.day || "",
    time: field(formData, `hours-time-${i}`) || current.hours[i]?.time || "",
  }));

  const trustPoints = current.trustPoints.map((p, i) => ({
    title: field(formData, `tp-title-${i}`) || p.title,
    text: field(formData, `tp-text-${i}`) || p.text,
  }));

  await writeContent("settings", {
    name: field(formData, "name") || current.name,
    legalName: field(formData, "legalName") || current.legalName,
    tagline: field(formData, "tagline") || current.tagline,
    description: field(formData, "description") || current.description,
    phone: field(formData, "phone") || current.phone,
    phoneSecondary: field(formData, "phoneSecondary"),
    email: field(formData, "email") || current.email,
    website: field(formData, "website") || current.website,
    whatsapp: field(formData, "whatsapp") || current.whatsapp,
    address: field(formData, "address") || current.address,
    latitude: lat,
    longitude: lng,
    mapEmbed: field(formData, "mapEmbed"),
    footerBlurb: field(formData, "footerBlurb") || current.footerBlurb,
    contactHeading: field(formData, "contactHeading") || current.contactHeading,
    contactIntro: field(formData, "contactIntro") || current.contactIntro,
    trustPoints,
    hours,
    social: {
      facebook: field(formData, "facebook") || "#",
      instagram: field(formData, "instagram") || "#",
      linkedin: field(formData, "linkedin") || "#",
    },
  });
  revalidateSite();
  redirect("/ecoshine_admin_panel/settings?saved=1");
}

/* ---------- SEO & metadata ---------- */

export async function saveSeoAction(formData: FormData) {
  await requireAdmin();

  // Enforce sensible SEO limits so titles/descriptions don't get truncated by
  // Google. Blank fields fall back to the baked-in defaults.
  const lengthErrors = seoPages.flatMap((p) => [
    maxLen(field(formData, `title-${p.key}`), 70, `${p.label} meta title`),
    maxLen(field(formData, `desc-${p.key}`), 200, `${p.label} meta description`),
  ]);
  const err = validateAll(...lengthErrors);
  if (err) fail("/ecoshine_admin_panel/seo", err);

  // Only persist a value when it differs from the default, so improvements to
  // the baked-in defaults keep flowing through to pages left untouched.
  const pages: Record<string, { title?: string; description?: string }> = {};
  for (const p of seoPages) {
    const title = field(formData, `title-${p.key}`);
    const description = field(formData, `desc-${p.key}`);
    const entry: { title?: string; description?: string } = {};
    if (title && title !== p.default.title) entry.title = title;
    if (description && description !== p.default.description) entry.description = description;
    if (Object.keys(entry).length) pages[p.key] = entry;
  }

  const metaKeywords = field(formData, "metaKeywords");

  await writeContent("seo", {
    global: metaKeywords ? { metaKeywords } : {},
    pages,
  });
  revalidateSite();
  redirect("/ecoshine_admin_panel/seo?saved=1");
}

/* ---------- legal pages ---------- */

export async function saveLegalAction(formData: FormData) {
  await requireAdmin();

  const key = field(formData, "key") as LegalKey;
  if (!legalPages.some((p) => p.key === key)) {
    fail("/ecoshine_admin_panel/legal", "Unknown legal page");
  }
  const back = `/ecoshine_admin_panel/legal?page=${key}`;

  const err = validateAll(required(field(formData, "title"), "Title"));
  if (err) fail(back, err);

  const count = Math.min(50, Math.max(0, parseInt(field(formData, "section-count"), 10) || 0));
  const sections: LegalSection[] = [];
  for (let i = 0; i < count; i++) {
    const heading = field(formData, `heading-${i}`);
    const body = field(formData, `body-${i}`);
    if (heading || body) sections.push({ heading, body });
  }

  const store = await readContent<Partial<Record<LegalKey, LegalPage>>>("legal", {});
  const next: LegalPage = {
    title: field(formData, "title"),
    subtitle: field(formData, "subtitle"),
    lastUpdated: field(formData, "lastUpdated"),
    intro: field(formData, "intro"),
    sections,
    showContact: formData.get("showContact") === "on",
  };

  await writeContent("legal", { ...store, [key]: next });
  revalidateSite();
  redirect(`${back}&saved=1`);
}

/* ---------- navigation & footer ---------- */

export async function saveNavigationAction(formData: FormData) {
  await requireAdmin();

  // Only store values that differ from the baked-in defaults, so the store
  // stays lean and default improvements still flow through.
  const topLabels: Record<string, string> = {};
  for (const k of ["overview", "services", "sectors", "explore"]) {
    const v = field(formData, `top-${k}`);
    if (v && v !== navTopDefaults[k]) topLabels[k] = v;
  }

  const footerHeadings: Record<string, string> = {};
  for (const k of ["services", "company"]) {
    const v = field(formData, `fh-${k}`);
    if (v && v !== navFooterHeadingDefaults[k]) footerHeadings[k] = v;
  }

  const links: Record<string, { label?: string; description?: string }> = {};
  for (const l of [...overviewLinks, ...exploreLinks]) {
    const label = field(formData, `ml-label-${l.href}`);
    const description = field(formData, `ml-desc-${l.href}`);
    const entry: { label?: string; description?: string } = {};
    if (label && label !== l.label) entry.label = label;
    if (description && description !== l.description) entry.description = description;
    if (Object.keys(entry).length) links[l.href] = entry;
  }
  for (const l of [...footerCompanyLinks, ...footerLegalLinks]) {
    const label = field(formData, `fl-label-${l.href}`);
    if (label && label !== l.label) links[`footer:${l.href}`] = { label };
  }

  await writeContent("navigation", { topLabels, footerHeadings, links });
  revalidateSite();
  redirect("/ecoshine_admin_panel/navigation?saved=1");
}

/* ---------- gallery ---------- */

export async function addGalleryImageAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("imageFile");
  if (!(file instanceof File) || file.size === 0) fail("/ecoshine_admin_panel/gallery", "Choose an image to upload");
  if (!uploadsEnabled) fail("/ecoshine_admin_panel/gallery", UPLOADS_DISABLED_MSG);
  const imgErr = validateImage(file);
  if (imgErr) fail("/ecoshine_admin_panel/gallery", `Image ${imgErr}`);
  const src = await saveUpload(file);
  const alt = field(formData, "alt") || "Ecoshine Solution cleaning team at work";

  const gallery = await getGallery();
  await writeContent("gallery", { shots: [{ src, alt }, ...gallery.shots] });
  revalidateSite();
  redirect("/ecoshine_admin_panel/gallery?saved=1");
}

export async function deleteGalleryImageAction(formData: FormData) {
  await requireAdmin();
  const src = field(formData, "src");
  const gallery = await getGallery();
  await writeContent("gallery", { shots: gallery.shots.filter((s) => s.src !== src) });
  if (src.startsWith("/uploads/")) {
    await fs.unlink(path.join(process.cwd(), "public", src)).catch(() => {});
  }
  revalidateSite();
  redirect("/ecoshine_admin_panel/gallery?saved=1");
}

/* ---------- jobs ---------- */

export async function saveJobAction(formData: FormData) {
  await requireAdmin();
  const jobs = await getJobs();
  const id = field(formData, "id") || `job-${Date.now()}`;
  const existing = jobs.find((j) => j.id === id);

  const err = validateAll(
    required(field(formData, "title"), "Job title"),
    maxLen(field(formData, "title"), 100, "Job title"),
    required(field(formData, "location"), "Location"),
    required(field(formData, "description"), "Description")
  );
  if (err) fail("/ecoshine_admin_panel/jobs", err);

  const job: Job = {
    id,
    title: field(formData, "title"),
    location: field(formData, "location"),
    type: field(formData, "type") || "Full-time",
    description: field(formData, "description"),
    active: formData.get("active") === "on",
    postedAt: existing?.postedAt ?? new Date().toISOString().slice(0, 10),
  };

  const next = existing ? jobs.map((j) => (j.id === id ? job : j)) : [job, ...jobs];
  await writeContent("jobs", { jobs: next });
  revalidateSite();
  redirect("/ecoshine_admin_panel/jobs?saved=1");
}

export async function deleteJobAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  const jobs = await getJobs();
  await writeContent("jobs", { jobs: jobs.filter((j) => j.id !== id) });
  revalidateSite();
  redirect("/ecoshine_admin_panel/jobs?saved=1");
}

/* ---------- blog ---------- */

export async function saveBlogPostAction(formData: FormData) {
  await requireAdmin();
  const posts = await getBlogPosts();

  const originalSlug = field(formData, "originalSlug");
  const title = field(formData, "title");
  const backPath = originalSlug ? `/ecoshine_admin_panel/blog/${originalSlug}` : "/ecoshine_admin_panel/blog/new";

  const err = validateAll(
    required(title, "Title"),
    maxLen(title, 120, "Title"),
    required(field(formData, "excerpt"), "Excerpt"),
    maxLen(field(formData, "excerpt"), 300, "Excerpt"),
    required(field(formData, "category"), "Category"),
    required(field(formData, "body"), "Article body"),
    isIsoDate(field(formData, "date"), "Publish date")
  );
  if (err) fail(backPath, err);

  const slug = originalSlug || slugify(field(formData, "slug") || title);
  if (!slug) fail(backPath, "Could not build a URL slug from the title");
  if (!originalSlug && posts.some((p) => p.slug === slug)) {
    fail(backPath, `A post with the slug "${slug}" already exists`);
  }
  const existing = posts.find((p) => p.slug === originalSlug);

  let image = field(formData, "image") || existing?.image || "/images/ecoshine-cleaning-team.jpg";
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    if (!uploadsEnabled) fail(backPath, UPLOADS_DISABLED_MSG);
    const imgErr = validateImage(file);
    if (imgErr) fail(backPath, `Cover image ${imgErr}`);
    image = await saveUpload(file);
  }

  const date = field(formData, "date") || existing?.date || new Date().toISOString().slice(0, 10);

  const post: BlogPost = {
    slug,
    title,
    excerpt: field(formData, "excerpt"),
    category: field(formData, "category") || "Commercial Cleaning",
    date,
    dateLabel: dateLabelFor(date),
    readTime: field(formData, "readTime") || "4 min read",
    image,
    imageAlt: field(formData, "imageAlt") || title,
    blocks: textToBlocks(field(formData, "body")),
  };

  const next = existing ? posts.map((p) => (p.slug === originalSlug ? post : p)) : [post, ...posts];
  await writeContent("blog", { posts: next });
  revalidateSite();
  redirect("/ecoshine_admin_panel/blog?saved=1");
}

export async function deleteBlogPostAction(formData: FormData) {
  await requireAdmin();
  const slug = field(formData, "slug");
  const posts = await getBlogPosts();
  await writeContent("blog", { posts: posts.filter((p) => p.slug !== slug) });
  revalidateSite();
  redirect("/ecoshine_admin_panel/blog?saved=1");
}

/* ---------- services (full CRUD) ---------- */

/** Build a URL slug not already taken, appending -2, -3, … on collision. */
function uniqueSlug(base: string, taken: string[]): string {
  if (!base) return "";
  let slug = base;
  let n = 2;
  while (taken.includes(slug)) slug = `${base}-${n++}`;
  return slug;
}

/** Collect optional detail-page overrides from a form; blank fields are dropped
    so the live page falls back to its computed default. */
function readPageContent(formData: FormData): DetailPageContent {
  const keys: (keyof DetailPageContent)[] = [
    "intro",
    "standardsEyebrow",
    "standardsTitle",
    "standardsText",
    "standardsTagline",
    "ctaTitle",
    "ctaDescription",
  ];
  const page: DetailPageContent = {};
  for (const k of keys) {
    const v = field(formData, `page-${k}`);
    if (v) page[k] = v;
  }
  return page;
}

export async function saveServiceAction(formData: FormData) {
  await requireAdmin();
  const items = await getServices();
  const originalSlug = field(formData, "slug"); // present => editing an existing one
  const title = field(formData, "title");

  const err = validateAll(
    required(title, "Title"),
    maxLen(title, 80, "Title"),
    required(field(formData, "short"), "Short name"),
    maxLen(field(formData, "short"), 40, "Short name"),
    required(field(formData, "blurb"), "Description"),
    maxLen(field(formData, "blurb"), 200, "Description")
  );
  if (err) fail("/ecoshine_admin_panel/services", err);

  const existing = originalSlug ? items.find((s) => s.slug === originalSlug) : undefined;
  if (originalSlug && !existing) fail("/ecoshine_admin_panel/services", "That service no longer exists");

  // Existing services keep their slug/URL so links never break; new ones get a
  // unique slug derived from the title.
  const slug = existing ? existing.slug : uniqueSlug(slugify(title), items.map((s) => s.slug));
  if (!slug) fail("/ecoshine_admin_panel/services", "Could not build a URL from the title");

  const categoryInput = field(formData, "category");
  const category: ServiceCategory = (serviceCategories as readonly string[]).includes(categoryInput)
    ? (categoryInput as ServiceCategory)
    : existing?.category ?? "Sector Programs";

  const iconInput = field(formData, "icon");
  const icon = iconRegistry[iconInput] ? iconInput : existing?.icon ?? DEFAULT_ICON_KEY;

  let image = field(formData, "image") || existing?.image || "/images/ecoshine-cleaning-team.jpg";
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    if (!uploadsEnabled) fail("/ecoshine_admin_panel/services", UPLOADS_DISABLED_MSG);
    const imgErr = validateImage(file);
    if (imgErr) fail("/ecoshine_admin_panel/services", `Image ${imgErr}`);
    image = await saveUpload(file);
  }

  const short = field(formData, "short");
  const service: Service = {
    title,
    short,
    slug,
    href: `/services/${slug}`,
    icon,
    category,
    blurb: field(formData, "blurb"),
    image,
    imageAlt: field(formData, "imageAlt") || title,
    keyword: field(formData, "keyword") || short.toLowerCase(),
  };
  const page = readPageContent(formData);
  if (Object.keys(page).length) service.page = page;

  const next = existing ? items.map((s) => (s.slug === slug ? service : s)) : [...items, service];
  await writeContent("services", { items: next });
  revalidateSite();
  redirect("/ecoshine_admin_panel/services?saved=1");
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdmin();
  const slug = field(formData, "slug");
  const items = await getServices();
  const target = items.find((s) => s.slug === slug);
  await writeContent("services", { items: items.filter((s) => s.slug !== slug) });
  if (target?.image.startsWith("/uploads/")) {
    await fs.unlink(path.join(process.cwd(), "public", target.image)).catch(() => {});
  }
  revalidateSite();
  redirect("/ecoshine_admin_panel/services?saved=1");
}

/* ---------- sectors (full CRUD) ---------- */

export async function saveSectorAction(formData: FormData) {
  await requireAdmin();
  const items = await getSectors();
  const originalSlug = field(formData, "slug");
  const name = field(formData, "name");

  const err = validateAll(
    required(name, "Name"),
    maxLen(name, 50, "Name"),
    required(field(formData, "blurb"), "Description"),
    maxLen(field(formData, "blurb"), 200, "Description")
  );
  if (err) fail("/ecoshine_admin_panel/sectors", err);

  const existing = originalSlug ? items.find((s) => s.slug === originalSlug) : undefined;
  if (originalSlug && !existing) fail("/ecoshine_admin_panel/sectors", "That sector no longer exists");

  const slug = existing ? existing.slug : uniqueSlug(slugify(name), items.map((s) => s.slug));
  if (!slug) fail("/ecoshine_admin_panel/sectors", "Could not build a URL from the name");

  const iconInput = field(formData, "icon");
  const icon = iconRegistry[iconInput] ? iconInput : existing?.icon ?? DEFAULT_ICON_KEY;

  let image = field(formData, "image") || existing?.image || "/images/ecoshine-cleaning-team.jpg";
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    if (!uploadsEnabled) fail("/ecoshine_admin_panel/sectors", UPLOADS_DISABLED_MSG);
    const imgErr = validateImage(file);
    if (imgErr) fail("/ecoshine_admin_panel/sectors", `Image ${imgErr}`);
    image = await saveUpload(file);
  }

  const sector: Sector = {
    name,
    slug,
    icon,
    blurb: field(formData, "blurb"),
    image,
    imageAlt: field(formData, "imageAlt") || name,
  };
  const page = readPageContent(formData);
  if (Object.keys(page).length) sector.page = page;

  const next = existing ? items.map((s) => (s.slug === slug ? sector : s)) : [...items, sector];
  await writeContent("sectors", { items: next });
  revalidateSite();
  redirect("/ecoshine_admin_panel/sectors?saved=1");
}

export async function deleteSectorAction(formData: FormData) {
  await requireAdmin();
  const slug = field(formData, "slug");
  const items = await getSectors();
  const target = items.find((s) => s.slug === slug);
  await writeContent("sectors", { items: items.filter((s) => s.slug !== slug) });
  if (target?.image.startsWith("/uploads/")) {
    await fs.unlink(path.join(process.cwd(), "public", target.image)).catch(() => {});
  }
  revalidateSite();
  redirect("/ecoshine_admin_panel/sectors?saved=1");
}

/* ---------- testimonials ---------- */

export async function saveTestimonialAction(formData: FormData) {
  await requireAdmin();
  const items = await getTestimonials();
  const id = field(formData, "id") || `t-${Date.now()}`;

  const err = validateAll(
    required(field(formData, "name"), "Name"),
    maxLen(field(formData, "name"), 60, "Name"),
    required(field(formData, "role"), "Role"),
    maxLen(field(formData, "role"), 80, "Role"),
    required(field(formData, "service"), "Service"),
    required(field(formData, "text"), "Testimonial text"),
    maxLen(field(formData, "text"), 500, "Testimonial text"),
    isRating(field(formData, "rating"), "Rating")
  );
  if (err) fail("/ecoshine_admin_panel/testimonials", err);

  const item: Testimonial = {
    id,
    name: field(formData, "name"),
    role: field(formData, "role"),
    service: field(formData, "service"),
    rating: Number(field(formData, "rating")),
    text: field(formData, "text"),
  };

  const exists = items.some((t) => t.id === id);
  const next = exists ? items.map((t) => (t.id === id ? item : t)) : [...items, item];
  await writeContent("testimonials", { items: next });
  revalidateSite();
  redirect("/ecoshine_admin_panel/testimonials?saved=1");
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  const items = await getTestimonials();
  await writeContent("testimonials", { items: items.filter((t) => t.id !== id) });
  revalidateSite();
  redirect("/ecoshine_admin_panel/testimonials?saved=1");
}

/* ---------- FAQs ---------- */

export async function saveFaqAction(formData: FormData) {
  await requireAdmin();
  const items = await getFaqs();
  const id = field(formData, "id") || `faq-${Date.now()}`;

  const err = validateAll(
    required(field(formData, "question"), "Question"),
    maxLen(field(formData, "question"), 150, "Question"),
    required(field(formData, "answer"), "Answer"),
    maxLen(field(formData, "answer"), 600, "Answer")
  );
  if (err) fail("/ecoshine_admin_panel/faqs", err);

  const item: FaqItem = {
    id,
    question: field(formData, "question"),
    answer: field(formData, "answer"),
  };

  const exists = items.some((f) => f.id === id);
  const next = exists ? items.map((f) => (f.id === id ? item : f)) : [...items, item];
  await writeContent("faqs", { items: next });
  revalidateSite();
  redirect("/ecoshine_admin_panel/faqs?saved=1");
}

export async function deleteFaqAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  const items = await getFaqs();
  await writeContent("faqs", { items: items.filter((f) => f.id !== id) });
  revalidateSite();
  redirect("/ecoshine_admin_panel/faqs?saved=1");
}

/* ---------- trusted-by logos ---------- */

export async function addTrustedLogoAction(formData: FormData) {
  await requireAdmin();
  const err = validateAll(
    required(field(formData, "name"), "Company name"),
    maxLen(field(formData, "name"), 60, "Company name")
  );
  if (err) fail("/ecoshine_admin_panel/logos", err);

  const file = formData.get("imageFile");
  if (!(file instanceof File) || file.size === 0) fail("/ecoshine_admin_panel/logos", "Choose a logo image to upload");
  if (!uploadsEnabled) fail("/ecoshine_admin_panel/logos", UPLOADS_DISABLED_MSG);
  const imgErr = validateImage(file);
  if (imgErr) fail("/ecoshine_admin_panel/logos", `Logo ${imgErr}`);

  const src = await saveUpload(file);
  const logos = await getTrustedLogos();
  await writeContent("trusted", { logos: [...logos, { src, name: field(formData, "name") }] });
  revalidateSite();
  redirect("/ecoshine_admin_panel/logos?saved=1");
}

export async function deleteTrustedLogoAction(formData: FormData) {
  await requireAdmin();
  const src = field(formData, "src");
  const logos = await getTrustedLogos();
  await writeContent("trusted", { logos: logos.filter((l) => l.src !== src) });
  if (src.startsWith("/uploads/")) {
    await fs.unlink(path.join(process.cwd(), "public", src)).catch(() => {});
  }
  revalidateSite();
  redirect("/ecoshine_admin_panel/logos?saved=1");
}

/* ---------- enquiries (contact + quote submissions) ---------- */

export async function markSubmissionReadAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  const read = field(formData, "read") !== "false"; // default -> mark as read
  const items = await getSubmissions();
  await writeContent("submissions", {
    items: items.map((s) => (s.id === id ? { ...s, read } : s)),
  });
  revalidatePath("/ecoshine_admin_panel/enquiries");
  redirect("/ecoshine_admin_panel/enquiries?saved=1");
}

export async function deleteSubmissionAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  const items = await getSubmissions();
  await writeContent("submissions", { items: items.filter((s) => s.id !== id) });
  revalidatePath("/ecoshine_admin_panel/enquiries");
  redirect("/ecoshine_admin_panel/enquiries?saved=1");
}

export async function markAllSubmissionsReadAction() {
  await requireAdmin();
  const items = await getSubmissions();
  await writeContent("submissions", { items: items.map((s) => ({ ...s, read: true })) });
  revalidatePath("/ecoshine_admin_panel/enquiries");
  redirect("/ecoshine_admin_panel/enquiries?saved=1");
}
