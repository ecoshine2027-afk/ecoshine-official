import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, Globe, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { getPageHero, getSettings } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contact");
}

function websiteLabel(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default async function ContactPage() {
  const [pageHero, settings] = await Promise.all([
    getPageHero("contact", {
      title: "Contact Us",
      subtitle:
        "We reply within 2 hours during business hours. Call, WhatsApp or send us a message.",
    }),
    getSettings(),
  ]);

  return (
    <>
      <PageHero
        title={pageHero.title}
        subtitle={pageHero.subtitle}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Company details */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">Get in touch</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Have a question or ready to book a clean? Reach us any of these ways — our
              team is happy to help.
            </p>

            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3.5">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Phone</p>
                  <a href={settings.phoneHref} className="text-sm font-semibold text-foreground hover:text-brand-600">
                    {settings.phone}
                  </a>
                  {settings.phoneSecondary && (
                    <a
                      href={`tel:+61${settings.phoneSecondary.replace(/\D/g, "").replace(/^0/, "")}`}
                      className="block text-sm font-semibold text-foreground hover:text-brand-600"
                    >
                      {settings.phoneSecondary}
                    </a>
                  )}
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Email</p>
                  <a href={`mailto:${settings.email}`} className="text-sm font-semibold text-foreground hover:text-brand-600">
                    {settings.email}
                  </a>
                </div>
              </li>

              {settings.website && (
                <li className="flex items-start gap-3.5">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
                    <Globe className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Website</p>
                    <a
                      href={settings.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-foreground hover:text-brand-600"
                    >
                      {websiteLabel(settings.website)}
                    </a>
                  </div>
                </li>
              )}

              {settings.whatsapp && settings.whatsapp !== "#" && (
                <li className="flex items-start gap-3.5">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">WhatsApp</p>
                    <a
                      href={settings.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-foreground hover:text-brand-600"
                    >
                      Chat with us on WhatsApp
                    </a>
                  </div>
                </li>
              )}

              <li className="flex items-start gap-3.5">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Location</p>
                  <p className="text-sm font-semibold text-foreground">{settings.address}</p>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
                  <Clock className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Opening hours</p>
                  <ul className="mt-1 space-y-1">
                    {settings.hours.map((h) => (
                      <li key={h.day} className="flex justify-between gap-4 text-sm">
                        <span className="text-muted">{h.day}</span>
                        <span className="font-medium text-foreground">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>

            {settings.mapEmbed && (
              <div className="mt-8 overflow-hidden rounded-card border border-border">
                <iframe
                  src={settings.mapEmbed}
                  title="Ecoshine Solution location map"
                  className="h-64 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Contact form */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
