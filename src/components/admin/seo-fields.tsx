"use client";

import { useState } from "react";
import { saveSeoAction } from "@/app/ecoshine_admin_panel/actions";
import { cardCls, inputCls, labelCls, primaryBtnCls, textareaCls } from "@/components/admin/ui";

export type SeoPageField = {
  key: string;
  label: string;
  path: string;
  title: string;
  description: string;
};

/* Google shows roughly these lengths before truncating. We surface them as a
   guide; the server enforces a higher hard cap (70 / 200). */
const TITLE_IDEAL = 60;
const DESC_IDEAL_MIN = 120;
const DESC_IDEAL_MAX = 160;

function Counter({ len, ideal, max }: { len: number; ideal: number; max?: number }) {
  const over = len > (max ?? ideal);
  const near = !over && len > ideal;
  const tone = over
    ? "text-red-600 dark:text-red-400"
    : near
      ? "text-amber-600 dark:text-amber-400"
      : "text-muted";
  return (
    <span className={`text-xs font-medium tabular-nums ${tone}`}>
      {len}
      {max ? `/${max}` : ""} chars
    </span>
  );
}

/** A single page's SERP preview (Google-style). */
function SerpPreview({ base, path, title, description }: { base: string; path: string; title: string; description: string }) {
  const crumb = path === "/" ? base : `${base}${path}`.replace(/\//g, " › ").replace(" › ", "/");
  return (
    <div className="rounded-btn border border-border bg-surface px-4 py-3">
      <p className="truncate text-xs text-emerald-700 dark:text-emerald-400">{crumb}</p>
      <p className="mt-0.5 truncate text-[17px] leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
        {title || "Untitled page"}
      </p>
      <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[#4d5156] dark:text-[#bdc1c6]">
        {description || "No description set."}
      </p>
    </div>
  );
}

export function SeoManager({
  base,
  pages,
  metaKeywords,
}: {
  base: string;
  pages: SeoPageField[];
  metaKeywords: string;
}) {
  const [vals, setVals] = useState<Record<string, { title: string; description: string }>>(
    () =>
      Object.fromEntries(
        pages.map((p) => [p.key, { title: p.title, description: p.description }]),
      ),
  );
  const [keywords, setKeywords] = useState(metaKeywords);

  const set = (key: string, patch: Partial<{ title: string; description: string }>) =>
    setVals((v) => ({ ...v, [key]: { ...v[key], ...patch } }));

  const keywordCount = keywords.split(",").map((k) => k.trim()).filter(Boolean).length;

  return (
    <form action={saveSeoAction} className="mt-6 space-y-5">
      {/* Global keywords */}
      <fieldset className={cardCls}>
        <legend className="px-1 text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300">
          Global Keywords
        </legend>
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <label htmlFor="metaKeywords" className={labelCls}>
              Keywords (comma-separated)
            </label>
            <span className="text-xs font-medium tabular-nums text-muted">{keywordCount} keywords</span>
          </div>
          <textarea
            id="metaKeywords"
            name="metaKeywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className={`${textareaCls} min-h-24`}
          />
          <p className="mt-1 text-xs text-muted">
            Applied site-wide as the <code>keywords</code> meta tag. Modern Google ignores this for
            ranking, but other engines and internal tools still read it. Focus your real ranking
            effort on the titles and descriptions below.
          </p>
        </div>
      </fieldset>

      {/* Per-page meta */}
      <div className="space-y-4">
        {pages.map((p) => {
          const v = vals[p.key];
          return (
            <fieldset key={p.key} className={cardCls}>
              <legend className="flex items-center gap-2 px-1">
                <span className="text-sm font-bold text-foreground">{p.label}</span>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">
                  {p.path}
                </span>
              </legend>

              <div className="mt-2">
                <SerpPreview base={base} path={p.path} title={v.title} description={v.description} />
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor={`title-${p.key}`} className={labelCls}>
                      Meta title
                    </label>
                    <Counter len={v.title.length} ideal={TITLE_IDEAL} max={70} />
                  </div>
                  <input
                    id={`title-${p.key}`}
                    name={`title-${p.key}`}
                    value={v.title}
                    onChange={(e) => set(p.key, { title: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor={`desc-${p.key}`} className={labelCls}>
                      Meta description
                    </label>
                    <Counter len={v.description.length} ideal={DESC_IDEAL_MAX} max={200} />
                  </div>
                  <textarea
                    id={`desc-${p.key}`}
                    name={`desc-${p.key}`}
                    value={v.description}
                    onChange={(e) => set(p.key, { description: e.target.value })}
                    className={`${textareaCls} min-h-20`}
                  />
                  <p className="mt-1 text-xs text-muted">
                    Aim for {DESC_IDEAL_MIN}–{DESC_IDEAL_MAX} characters.
                  </p>
                </div>
              </div>
            </fieldset>
          );
        })}
      </div>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button type="submit" className={primaryBtnCls}>
          Save SEO Settings
        </button>
      </div>
    </form>
  );
}
