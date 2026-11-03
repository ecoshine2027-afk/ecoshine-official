import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getPageHero } from "@/lib/content";
import { QuoteForm } from "@/components/quote/quote-form";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("quote");
}

export default async function QuotePage() {
  const pageHero = await getPageHero("quote", {
    title: "Get a Free Quote",
    subtitle:
      "Tell us about your space and we will send a tailored, no-obligation quote fast.",
  });

  return (
    <>
      <PageHero
        title={pageHero.title}
        subtitle={pageHero.subtitle}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Get a Quote" }]}
      />
      <section className="container-page py-14">
        <div className="mx-auto max-w-2xl rounded-card border border-border bg-card p-6 shadow-sm sm:p-8">
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
