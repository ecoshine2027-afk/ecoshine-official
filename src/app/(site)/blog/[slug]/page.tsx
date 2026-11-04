import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { PageCta } from "@/components/page-cta";
import { site } from "@/lib/site";
import type { BlogBlock } from "@/lib/blog";
import { getBlogPosts, getBlogPost, getSettings } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${site.url.replace(/\/$/, "")}/blog/${post.slug}`,
      images: [{ url: post.image, alt: post.imageAlt }],
      publishedTime: post.date,
    },
  };
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-10 text-2xl font-bold text-foreground sm:text-3xl">{block.text}</h2>
      );
    case "ul":
      return (
        <ul className="mt-5 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-muted">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
              {item}
            </li>
          ))}
        </ul>
      );
    default:
      return <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{block.text}</p>;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const [related, settings] = await Promise.all([
    getBlogPosts().then((posts) => posts.filter((p) => p.slug !== post.slug).slice(0, 3)),
    getSettings(),
  ]);
  const orgName = settings.name || site.name;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${site.url}${post.image}`,
    datePublished: post.date,
    author: { "@type": "Organization", name: orgName, url: site.url },
    publisher: { "@type": "Organization", name: orgName, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        title={post.title}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <article className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-muted">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-600/15 dark:text-brand-300">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <time dateTime={post.date}>{post.dateLabel}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>

          {/* Hero image */}
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-card border border-border shadow-md">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>

          {/* Body */}
          <div className="mt-4">
            {post.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </div>
      </article>

      {/* Related articles */}
      <section className="bg-surface py-16">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground">More From the Blog</h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-300"
            >
              View all articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-card border border-border bg-card transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg dark:hover:border-brand-400/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-300">
                    {p.category}
                  </span>
                  <h3 className="mt-2 flex-1 text-base font-bold leading-snug text-foreground">
                    {p.title}
                  </h3>
                  <span className="mt-3 text-xs font-medium text-muted">
                    {p.dateLabel} · {p.readTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PageCta
        title="Put This Advice to Work at Your Site"
        description="Tell us about your space and we'll send a tailored, no-obligation quote fast, backed by our satisfaction guarantee."
      />
    </>
  );
}
