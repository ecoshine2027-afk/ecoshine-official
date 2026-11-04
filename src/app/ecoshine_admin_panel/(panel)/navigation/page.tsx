import {
  getNavigation,
  navTopDefaults,
  navFooterHeadingDefaults,
  footerCompanyLinks,
  footerLegalLinks,
} from "@/lib/content";
import { overviewLinks, exploreLinks } from "@/lib/site";
import { saveNavigationAction } from "@/app/ecoshine_admin_panel/actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { cardCls, inputCls, labelCls, primaryBtnCls } from "@/components/admin/ui";

const legendCls =
  "px-1 text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300";

export default async function AdminNavigationPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const nav = await getNavigation();

  const topKeys = ["overview", "services", "sectors", "explore"] as const;
  const footerHeadingKeys = ["services", "company"] as const;

  // Mega-menu links (label + description editable; route fixed).
  const megaGroups = [
    { heading: "Overview menu", links: overviewLinks },
    { heading: "Explore menu", links: exploreLinks },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Navigation &amp; Footer</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Rename the menu items, dropdown descriptions and footer links. The destination of each link
        stays fixed so nothing breaks — only the wording changes. (Service &amp; sector menu items
        are edited under Services and Sectors.)
      </p>
      <SavedBanner saved={saved} error={error} />

      <form action={saveNavigationAction} className="mt-6 space-y-4">
        {/* Top-level labels */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Main menu labels</legend>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topKeys.map((k) => (
              <div key={k}>
                <label htmlFor={`top-${k}`} className={labelCls}>
                  {navTopDefaults[k]}
                </label>
                <input
                  id={`top-${k}`}
                  name={`top-${k}`}
                  defaultValue={nav.topLabels[k]}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </fieldset>

        {/* Mega-menu link labels + descriptions */}
        {megaGroups.map((group) => (
          <fieldset key={group.heading} className={cardCls}>
            <legend className={legendCls}>{group.heading}</legend>
            <div className="mt-2 space-y-4">
              {group.links.map((l) => {
                const o = nav.links[l.href] ?? {};
                return (
                  <div key={l.href} className="rounded-btn border border-border bg-surface p-3">
                    <p className="mb-2 font-mono text-[11px] text-muted">{l.href}</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr]">
                      <input
                        name={`ml-label-${l.href}`}
                        defaultValue={o.label || l.label}
                        placeholder="Label"
                        className={inputCls}
                      />
                      <input
                        name={`ml-desc-${l.href}`}
                        defaultValue={o.description || l.description}
                        placeholder="Dropdown description"
                        className={inputCls}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}

        {/* Footer */}
        <fieldset className={cardCls}>
          <legend className={legendCls}>Footer</legend>
          <div className="mt-2 space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {footerHeadingKeys.map((k) => (
                <div key={k}>
                  <label htmlFor={`fh-${k}`} className={labelCls}>
                    {navFooterHeadingDefaults[k]} column heading
                  </label>
                  <input
                    id={`fh-${k}`}
                    name={`fh-${k}`}
                    defaultValue={nav.footerHeadings[k]}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>

            <div>
              <p className={labelCls}>Company column links</p>
              <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {footerCompanyLinks.map((l) => (
                  <input
                    key={l.href}
                    name={`fl-label-${l.href}`}
                    defaultValue={nav.links[`footer:${l.href}`]?.label || l.label}
                    className={inputCls}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className={labelCls}>Legal links (bottom bar)</p>
              <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {footerLegalLinks.map((l) => (
                  <input
                    key={l.href}
                    name={`fl-label-${l.href}`}
                    defaultValue={nav.links[`footer:${l.href}`]?.label || l.label}
                    className={inputCls}
                  />
                ))}
              </div>
            </div>
          </div>
        </fieldset>

        <div className="sticky bottom-4 flex justify-end">
          <button type="submit" className={`${primaryBtnCls} shadow-lg`}>
            Save Navigation
          </button>
        </div>
      </form>
    </div>
  );
}
