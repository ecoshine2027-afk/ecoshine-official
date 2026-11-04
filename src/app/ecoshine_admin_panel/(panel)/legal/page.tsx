import Link from "next/link";
import { getLegalPage, legalPages, type LegalKey } from "@/lib/content";
import { SavedBanner } from "@/components/admin/saved-banner";
import { LegalEditor } from "@/components/admin/legal-editor";

export default async function AdminLegalPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; saved?: string; error?: string }>;
}) {
  const { page: pageParam, saved, error } = await searchParams;
  const active: LegalKey =
    legalPages.find((p) => p.key === pageParam)?.key ?? legalPages[0].key;
  const page = await getLegalPage(active);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Legal Pages</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Edit the Privacy Policy and Terms &amp; Conditions. Add, remove or reorder sections, and the
        &ldquo;last updated&rdquo; date and contact block stay in sync with your Settings.
      </p>

      {/* Page tabs */}
      <div className="mt-5 flex gap-2">
        {legalPages.map((p) => (
          <Link
            key={p.key}
            href={`/ecoshine_admin_panel/legal?page=${p.key}`}
            className={`rounded-btn px-4 py-2 text-sm font-semibold transition-colors ${
              p.key === active
                ? "bg-brand-600 text-white"
                : "border border-border bg-card text-foreground hover:bg-surface-2"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      <SavedBanner saved={saved} error={error} />

      <LegalEditor key={active} legalKey={active} page={page} />
    </div>
  );
}
