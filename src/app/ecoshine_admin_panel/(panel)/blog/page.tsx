import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getBlogPosts } from "@/lib/content";
import { deleteBlogPostAction } from "@/app/ecoshine_admin_panel/actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { dangerBtnCls, primaryBtnCls, secondaryBtnCls } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const posts = await getBlogPosts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="mt-1 text-sm text-muted">
            {posts.length} article{posts.length === 1 ? "" : "s"} live on the blog.
          </p>
        </div>
        <Link href="/ecoshine_admin_panel/blog/new" className={primaryBtnCls}>
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>
      <SavedBanner saved={saved} error={error} />

      <div className="mt-6 space-y-3">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="flex flex-col gap-4 rounded-card border border-border bg-card p-4 sm:flex-row sm:items-center"
          >
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-btn border border-border sm:w-36">
              <Image src={post.image} alt={post.imageAlt} fill sizes="144px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-brand-600 dark:text-brand-300">
                {post.category}
              </p>
              <h2 className="mt-0.5 truncate text-base font-bold text-foreground">{post.title}</h2>
              <p className="mt-0.5 text-xs text-muted">
                {post.dateLabel} · {post.readTime} · /blog/{post.slug}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link href={`/ecoshine_admin_panel/blog/${post.slug}`} className={secondaryBtnCls}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
              <form action={deleteBlogPostAction}>
                <input type="hidden" name="slug" value={post.slug} />
                <SubmitButton className={dangerBtnCls} pendingText="Deleting…" spinnerSize={14}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </SubmitButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
