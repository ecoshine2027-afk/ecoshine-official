import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { trustPoints as defaultTrustPoints, type StandardsContent } from "@/lib/site";
import { PageCta } from "@/components/page-cta";
import { ServiceExpertise } from "@/components/service-expertise";
import { TeamStandards } from "@/components/team-standards";

export function DetailPage({
  intro,
  image,
  imageAlt,
  expertiseContext,
  standards,
  related,
  relatedLabel,
  ctaTitle,
  ctaDescription,
  trustPoints,
}: {
  intro: string;
  image: string;
  imageAlt: string;
  expertiseContext: string;
  standards: StandardsContent;
  related: { label: string; href: string }[];
  relatedLabel: string;
  ctaTitle: string;
  ctaDescription: string;
  trustPoints?: { title: string; text: string }[];
}) {
  const points = (trustPoints ?? defaultTrustPoints).slice(0, 4);
  return (
    <>
      <section className="py-16 sm:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-card border border-border shadow-lg lg:order-1">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-base leading-relaxed text-muted">{intro}</p>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p.title} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-eco-500" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.title}</p>
                    <p className="text-xs leading-relaxed text-muted">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ServiceExpertise context={expertiseContext} />

      <TeamStandards standards={standards} />

      {related.length > 0 && (
        <section className="py-16">
          <div className="container-page">
            <h2 className="text-2xl font-bold text-foreground">{relatedLabel}</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group flex items-center justify-between rounded-card border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                >
                  <span className="font-semibold text-foreground">{r.label}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-brand-600 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PageCta title={ctaTitle} description={ctaDescription} />
    </>
  );
}
