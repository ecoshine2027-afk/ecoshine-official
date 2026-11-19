import { Plus, Trash2, Pencil } from "lucide-react";
import { getJobs } from "@/lib/content";
import { deleteJobAction, saveJobAction } from "@/app/ecoshine_admin_panel/actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import {
  cardCls,
  dangerBtnCls,
  inputCls,
  labelCls,
  primaryBtnCls,
  textareaCls,
} from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";

function JobForm({ job }: { job?: Awaited<ReturnType<typeof getJobs>>[number] }) {
  return (
    <form action={saveJobAction} className="space-y-4">
      {job && <input type="hidden" name="id" value={job.id} />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls} htmlFor={`title-${job?.id ?? "new"}`}>
            Job title
          </label>
          <input
            id={`title-${job?.id ?? "new"}`}
            name="title"
            required
            defaultValue={job?.title}
            placeholder="e.g. Commercial Cleaner"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor={`location-${job?.id ?? "new"}`}>
            Location
          </label>
          <input
            id={`location-${job?.id ?? "new"}`}
            name="location"
            defaultValue={job?.location}
            placeholder="e.g. Sydney, NSW"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor={`type-${job?.id ?? "new"}`}>
            Employment type
          </label>
          <select
            id={`type-${job?.id ?? "new"}`}
            name="type"
            defaultValue={job?.type ?? "Full-time"}
            className={inputCls}
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Casual</option>
            <option>Contract</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor={`description-${job?.id ?? "new"}`}>
          Description
        </label>
        <textarea
          id={`description-${job?.id ?? "new"}`}
          name="description"
          defaultValue={job?.description}
          placeholder="What the role involves, requirements, and how to apply."
          className={textareaCls}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground">
          <input
            type="checkbox"
            name="active"
            defaultChecked={job?.active ?? true}
            className="h-4 w-4 cursor-pointer accent-brand-600"
          />
          Visible on the Careers page
        </label>
        <SubmitButton className={primaryBtnCls}>
          {job ? "Save Job" : (
            <>
              <Plus className="h-4 w-4" />
              Add Job
            </>
          )}
        </SubmitButton>
      </div>
    </form>
  );
}

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const jobs = await getJobs();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Job Vacancies</h1>
      <p className="mt-1 text-sm text-muted">
        Openings shown on the Careers page. Untick visibility to hide a role without
        deleting it.
      </p>
      <SavedBanner saved={saved} error={error} />

      {/* Add new */}
      <details className={`${cardCls} mt-6`}>
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-300">
          <Plus className="h-4 w-4" />
          Post a new job
        </summary>
        <div className="mt-4">
          <JobForm />
        </div>
      </details>

      {/* List */}
      <div className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card">
        {jobs.length === 0 && (
          <p className="p-4 text-sm text-muted">No jobs yet. Post the first one above.</p>
        )}
        {jobs.map((job) => (
          <details key={job.id} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-foreground">{job.title}</p>
                  {!job.active && (
                    <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-muted">
                  {job.location} · {job.type} · Posted {job.postedAt}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-btn border border-border px-3 py-1.5 text-xs font-semibold text-foreground group-open:border-brand-300 group-open:text-brand-600 dark:group-open:text-brand-300">
                <Pencil className="h-3.5 w-3.5" />
                <span className="group-open:hidden">Edit</span>
                <span className="hidden group-open:inline">Close</span>
              </span>
            </summary>
            <div className="border-t border-border p-4">
              <JobForm job={job} />
              <form action={deleteJobAction} className="mt-4 flex justify-end border-t border-border pt-4">
                <input type="hidden" name="id" value={job.id} />
                <SubmitButton className={dangerBtnCls} pendingText="Deleting…" spinnerSize={14}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </SubmitButton>
              </form>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
