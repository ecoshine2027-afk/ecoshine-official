"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { saveLegalAction } from "@/app/ecoshine_admin_panel/actions";
import type { LegalPage } from "@/lib/content";
import {
  cardCls,
  inputCls,
  labelCls,
  primaryBtnCls,
  secondaryBtnCls,
  dangerBtnCls,
  textareaCls,
} from "@/components/admin/ui";

const legendCls =
  "px-1 text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300";

export function LegalEditor({ legalKey, page }: { legalKey: string; page: LegalPage }) {
  const [sections, setSections] = useState(page.sections);

  const update = (i: number, patch: Partial<{ heading: string; body: string }>) =>
    setSections((s) => s.map((sec, j) => (j === i ? { ...sec, ...patch } : sec)));
  const add = () => setSections((s) => [...s, { heading: "", body: "" }]);
  const remove = (i: number) => setSections((s) => s.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) =>
    setSections((s) => {
      const j = i + dir;
      if (j < 0 || j >= s.length) return s;
      const next = [...s];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <form action={saveLegalAction} className="mt-6 space-y-4">
      <input type="hidden" name="key" value={legalKey} />

      <fieldset className={cardCls}>
        <legend className={legendCls}>Page header</legend>
        <div className="mt-2 space-y-4">
          <div>
            <label htmlFor="title" className={labelCls}>
              Title
            </label>
            <input id="title" name="title" required defaultValue={page.title} className={inputCls} />
          </div>
          <div>
            <label htmlFor="subtitle" className={labelCls}>
              Subtitle
            </label>
            <input id="subtitle" name="subtitle" defaultValue={page.subtitle} className={inputCls} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lastUpdated" className={labelCls}>
                &ldquo;Last updated&rdquo; date
              </label>
              <input
                id="lastUpdated"
                name="lastUpdated"
                defaultValue={page.lastUpdated}
                className={inputCls}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 self-end rounded-btn border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                name="showContact"
                defaultChecked={page.showContact}
                className="h-4 w-4 accent-brand-600"
              />
              Show a &ldquo;Contact us&rdquo; block (uses your Settings details)
            </label>
          </div>
          <div>
            <label htmlFor="intro" className={labelCls}>
              Intro paragraph
            </label>
            <textarea id="intro" name="intro" defaultValue={page.intro} className={`${textareaCls} min-h-24`} />
            <p className="mt-1 text-xs text-muted">
              Tip: type <code>{"{business}"}</code> anywhere to insert your legal business name
              automatically. Leave a blank line between paragraphs, and start a line with{" "}
              <code>-&nbsp;</code> to make a bullet point.
            </p>
          </div>
        </div>
      </fieldset>

      <input type="hidden" name="section-count" value={sections.length} />

      <div className="space-y-4">
        {sections.map((s, i) => (
          <fieldset key={i} className={cardCls}>
            <legend className="flex items-center gap-2 px-1">
              <span className="text-sm font-bold text-foreground">Section {i + 1}</span>
            </legend>
            <div className="mt-2 space-y-3">
              <input
                name={`heading-${i}`}
                value={s.heading}
                onChange={(e) => update(i, { heading: e.target.value })}
                placeholder="Section heading"
                className={inputCls}
              />
              <textarea
                name={`body-${i}`}
                value={s.body}
                onChange={(e) => update(i, { body: e.target.value })}
                placeholder="Section text. Blank line = new paragraph. Start a line with '- ' for a bullet."
                className={`${textareaCls} min-h-32`}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className={`${secondaryBtnCls} h-9 px-3 disabled:opacity-40`}
                  aria-label="Move section up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === sections.length - 1}
                  className={`${secondaryBtnCls} h-9 px-3 disabled:opacity-40`}
                  aria-label="Move section down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => remove(i)} className={`${dangerBtnCls} ml-auto`}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      <button type="button" onClick={add} className={secondaryBtnCls}>
        <Plus className="h-4 w-4" />
        Add section
      </button>

      <div className="sticky bottom-4 flex justify-end">
        <button type="submit" className={`${primaryBtnCls} shadow-lg`}>
          Save Page
        </button>
      </div>
    </form>
  );
}
