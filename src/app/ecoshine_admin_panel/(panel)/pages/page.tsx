import { getAllPageHeroes, editablePages } from "@/lib/content";
import { savePagesAction } from "@/app/ecoshine_admin_panel/actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { cardCls, inputCls, labelCls, primaryBtnCls, textareaCls } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const heroes = await getAllPageHeroes();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Page Titles</h1>
      <p className="mt-1 text-sm text-muted">
        Override the heading and subtitle shown in the blue banner at the top of each page.
        Leave a field empty to keep the built-in default.
      </p>
      <SavedBanner saved={saved} error={error} />

      <form action={savePagesAction} className="mt-6 space-y-4">
        {editablePages.map((page) => {
          const hero = heroes[page.key];
          return (
            <fieldset key={page.key} className={cardCls}>
              <legend className="px-1 text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300">
                {page.label}
              </legend>
              <div className="mt-2 space-y-3">
                <div>
                  <label htmlFor={`${page.key}-title`} className={labelCls}>
                    Title
                  </label>
                  <input
                    id={`${page.key}-title`}
                    name={`${page.key}-title`}
                    defaultValue={hero?.title ?? ""}
                    placeholder="Keep default"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor={`${page.key}-subtitle`} className={labelCls}>
                    Subtitle
                  </label>
                  <textarea
                    id={`${page.key}-subtitle`}
                    name={`${page.key}-subtitle`}
                    defaultValue={hero?.subtitle ?? ""}
                    placeholder="Keep default"
                    className={`${textareaCls} min-h-20`}
                  />
                </div>
              </div>
            </fieldset>
          );
        })}
        <SubmitButton className={primaryBtnCls}>Save All Pages</SubmitButton>
      </form>
    </div>
  );
}
