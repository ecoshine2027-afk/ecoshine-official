import { getPageSeo, getGlobalSeo, seoPages } from "@/lib/content";
import { site } from "@/lib/site";
import { SavedBanner } from "@/components/admin/saved-banner";
import { SeoManager, type SeoPageField } from "@/components/admin/seo-fields";

export default async function AdminSeoPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;

  const [global, metas] = await Promise.all([
    getGlobalSeo(),
    Promise.all(seoPages.map((p) => getPageSeo(p.key))),
  ]);

  const fields: SeoPageField[] = seoPages.map((p, i) => ({
    key: p.key,
    label: p.label,
    path: p.path,
    title: metas[i].title,
    description: metas[i].description,
  }));

  const base = site.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">SEO &amp; Metadata</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Control the title and description Google shows for every page, plus site-wide keywords.
        Each preview mirrors how your result looks in search. Leave a field blank to use the
        optimised default.
      </p>
      <p className="mt-2 max-w-2xl text-xs text-muted">
        <strong>Answer engines (AEO):</strong> your FAQ answers power Google&apos;s AI Overviews and
        tools like ChatGPT — edit those under{" "}
        <span className="font-semibold">FAQs</span>. <strong>Local (GEO):</strong> your map
        coordinates and address live under <span className="font-semibold">Settings</span>.
      </p>

      <SavedBanner saved={saved} error={error} />

      <SeoManager base={base} pages={fields} metaKeywords={global.metaKeywords} />
    </div>
  );
}
