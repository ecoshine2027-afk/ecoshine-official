import { PageHero } from "@/components/page-hero";
import type { LegalPage, SiteSettings } from "@/lib/content";

/** Replace the {business} token with the live legal name. */
function fill(text: string, business: string): string {
  return text.replaceAll("{business}", business);
}

/** Render one body string: blank-line-separated blocks become paragraphs, and
    any block whose lines all start with "- " becomes a bulleted list. */
function Body({ text, business }: { text: string; business: string }) {
  const blocks = fill(text, business)
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => l.startsWith("- "));
        if (isList) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^-\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{lines.join(" ")}</p>;
      })}
    </>
  );
}

export function LegalPageView({
  page,
  settings,
  crumbLabel,
}: {
  page: LegalPage;
  settings: SiteSettings;
  crumbLabel: string;
}) {
  const business = settings.legalName;

  return (
    <>
      <PageHero
        title={page.title}
        subtitle={fill(page.subtitle, business)}
        breadcrumb={[{ label: "Home", href: "/" }, { label: crumbLabel }]}
      />

      <section className="container-page py-14 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-muted">Last updated: {page.lastUpdated}</p>

          <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-muted [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
            {page.intro.trim() && (
              <div>
                <Body text={page.intro} business={business} />
              </div>
            )}

            {page.sections.map((s, i) => (
              <div key={i}>
                {s.heading.trim() && <h2>{s.heading}</h2>}
                <Body text={s.body} business={business} />
              </div>
            ))}

            {page.showContact && (
              <div>
                <h2>Contact us</h2>
                <p>
                  If you have any questions, please contact us:
                </p>
                <ul>
                  <li>
                    Email:{" "}
                    <a
                      href={`mailto:${settings.email}`}
                      className="font-medium text-brand-600 hover:underline dark:text-brand-300"
                    >
                      {settings.email}
                    </a>
                  </li>
                  <li>
                    Phone:{" "}
                    <a
                      href={settings.phoneHref}
                      className="font-medium text-brand-600 hover:underline dark:text-brand-300"
                    >
                      {settings.phone}
                    </a>
                  </li>
                  {settings.address.trim() && <li>Location: {settings.address}</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
