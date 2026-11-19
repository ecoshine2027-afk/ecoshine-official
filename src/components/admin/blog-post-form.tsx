import Image from "next/image";
import type { BlogPost } from "@/lib/blog";
import { blocksToText } from "@/lib/blog-format";
import { saveBlogPostAction } from "@/app/ecoshine_admin_panel/actions";
import { cardCls, inputCls, labelCls, primaryBtnCls, textareaCls } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";

export function BlogPostForm({
  post,
  categories,
}: {
  post?: BlogPost;
  categories: string[];
}) {
  return (
    <form action={saveBlogPostAction} className={`${cardCls} space-y-5`}>
      {post && <input type="hidden" name="originalSlug" value={post.slug} />}

      <div>
        <label htmlFor="title" className={labelCls}>
          Title
        </label>
        <input id="title" name="title" required maxLength={120} defaultValue={post?.title} className={inputCls} />
      </div>

      {!post && (
        <div>
          <label htmlFor="slug" className={labelCls}>
            URL slug (optional, generated from the title if left empty)
          </label>
          <input
            id="slug"
            name="slug"
            pattern="[a-z0-9-]*"
            title="Lowercase letters, numbers and hyphens only"
            placeholder="e.g. my-article-title"
            className={inputCls}
          />
        </div>
      )}

      <div>
        <label htmlFor="excerpt" className={labelCls}>
          Excerpt (shown on the blog listing and in search results)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          maxLength={300}
          defaultValue={post?.excerpt}
          className={`${textareaCls} min-h-20`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="category" className={labelCls}>
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={post?.category ?? categories[0]}
            className={inputCls}
          >
            {post?.category && !categories.includes(post.category) && (
              <option value={post.category}>{post.category}</option>
            )}
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className={labelCls}>
            Publish date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={post?.date ?? new Date().toISOString().slice(0, 10)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="readTime" className={labelCls}>
            Read time
          </label>
          <input
            id="readTime"
            name="readTime"
            defaultValue={post?.readTime ?? "4 min read"}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[10rem_1fr]">
        {post ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-btn border border-border">
            <Image src={post.image} alt={post.imageAlt} fill sizes="160px" className="object-cover" />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center rounded-btn border border-dashed border-border text-xs text-muted">
            No image yet
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="imageFile" className={labelCls}>
              {post ? "Replace cover image" : "Cover image"} (JPG, PNG or WebP, max 8MB)
            </label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className={`${inputCls} cursor-pointer file:mr-3 file:cursor-pointer file:rounded-btn file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700`}
            />
            {post && <input type="hidden" name="image" value={post.image} />}
          </div>
          <div>
            <label htmlFor="imageAlt" className={labelCls}>
              Image description (alt text)
            </label>
            <input id="imageAlt" name="imageAlt" maxLength={150} defaultValue={post?.imageAlt} className={inputCls} />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="body" className={labelCls}>
          Article body
        </label>
        <p className="mt-1 text-xs text-muted">
          Start a line with <code className="rounded bg-surface-2 px-1">## </code> for a section
          heading, <code className="rounded bg-surface-2 px-1">- </code> for a bullet point, and
          separate paragraphs with a blank line.
        </p>
        <textarea
          id="body"
          name="body"
          required
          defaultValue={post ? blocksToText(post.blocks) : ""}
          className={`${textareaCls} min-h-96 font-mono text-xs`}
        />
      </div>

      <SubmitButton className={primaryBtnCls}>{post ? "Save Changes" : "Publish Post"}</SubmitButton>
    </form>
  );
}
