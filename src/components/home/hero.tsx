import Image from "next/image";
import { Star, Phone, ArrowRight, Leaf, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { QuoteButton } from "@/components/quote/quote-button";
import { TrustedBy } from "@/components/home/trusted-by";
import { getHomepage, getSettings, getTrustedLogos, getServiceAreas } from "@/lib/content";

export async function Hero() {
  const [{ hero }, settings, logos, areas] = await Promise.all([
    getHomepage(),
    getSettings(),
    getTrustedLogos(),
    getServiceAreas(),
  ]);

  return (
    <section className="relative overflow-hidden">
      <div className="relative flex min-h-[600px] items-center overflow-hidden py-20 lg:min-h-[720px] lg:py-28">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark scrim: strongest behind the copy, fading out toward the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        <div className="container-page relative">
          <div className="max-w-xl">
            {hero.badge.trim() && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <Leaf className="h-3.5 w-3.5" />
                {hero.badge}
              </span>
            )}

            <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {hero.titlePre}{" "}
              <span className="bg-gradient-to-r from-brand-200 via-brand-300 to-white bg-clip-text text-transparent">
                {hero.titleHighlight}
              </span>{" "}
              {hero.titlePost}
            </h1>

            <p className="mt-6 text-xl leading-relaxed text-white/85">{hero.description}</p>

            {areas.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-white/90">
                {areas.map((area) => {
                  const launching = area.status === "launching";
                  return (
                    <span key={area.id} className="inline-flex items-center gap-1.5">
                      <MapPin className={`h-4 w-4 ${launching ? "text-amber-400" : "text-brand-300"}`} />
                      {area.id.toUpperCase()}
                      {launching && area.launchDate ? ` (Launching ${area.launchDate})` : ""}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <QuoteButton size="lg" className="group">
                Get a Free Quote
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </QuoteButton>
              <ButtonLink href="/services" size="lg" variant="secondary">
                View Services
              </ButtonLink>
            </div>

            <a
              href={settings.phoneHref}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white"
            >
              <Phone className="h-4 w-4 text-brand-300" />
              Or call us today on {settings.phone}
            </a>
          </div>
        </div>

        {/* Floating rating card */}
        <div className="absolute bottom-6 right-6 hidden items-center gap-3 rounded-card bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:flex lg:right-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted">
              <span className="font-bold text-foreground">{hero.ratingValue}</span>{" "}
              {hero.ratingNote}
            </p>
          </div>
        </div>
      </div>

      <TrustedBy logos={logos} />
    </section>
  );
}
