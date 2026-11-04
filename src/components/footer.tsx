import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Leaf,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { Logo } from "@/components/logo";
import type { SiteSettings } from "@/lib/content";

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07Z" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9c-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.8.72 1.48 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.15A3.99 3.99 0 1 1 16 12a3.99 3.99 0 0 1-4 3.99ZM19.85 4.15a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

const FOOTER_SERVICE_COUNT = 6;

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Sectors", href: "/sectors" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Get a Quote", href: "/quote" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export function Footer({
  settings,
  services,
}: {
  settings: SiteSettings;
  services: { short: string; href: string }[];
}) {
  const socials = [
    { label: "Facebook", href: settings.social.facebook, icon: FacebookIcon },
    { label: "Instagram", href: settings.social.instagram, icon: InstagramIcon },
    { label: "LinkedIn", href: settings.social.linkedin, icon: LinkedInIcon },
  ].filter((s) => s.href && s.href !== "#");

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + contact */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {settings.footerBlurb}
          </p>
          <div className="mt-5 flex flex-col gap-2.5 text-sm">
            <a href={settings.phoneHref} className="flex items-center gap-2.5 text-foreground hover:text-brand-600">
              <Phone className="h-4 w-4 text-brand-600" />
              {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 text-foreground hover:text-brand-600">
              <Mail className="h-4 w-4 text-brand-600" />
              {settings.email}
            </a>
            <span className="flex items-center gap-2.5 text-muted">
              <MapPin className="h-4 w-4 text-brand-600" />
              {settings.address}
            </span>
          </div>
          {socials.length > 0 && (
            <div className="mt-5 flex items-center gap-2">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted transition-colors hover:border-brand-300 hover:text-brand-600"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Services */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Services
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {services.slice(0, FOOTER_SERVICE_COUNT).map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="text-muted transition-colors hover:text-brand-600">
                  {s.short}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300">
                View all services
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Company
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition-colors hover:text-brand-600">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
            <Clock className="h-4 w-4 text-brand-600" />
            Opening Hours
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {settings.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-3 text-muted">
                <span>{h.day}</span>
                <span className="font-medium text-foreground">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-border">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-5 text-xs font-medium text-muted">
          <span className="flex items-center gap-1.5"><Leaf className="h-4 w-4 text-eco-500" /> Eco-Certified</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-brand-600" /> Fully Insured</span>
          <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-brand-600" /> Police-Checked Staff</span>
          <span>BSCAA Member</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.legalName}. All rights reserved.</p>
          <ul className="flex items-center gap-5">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-brand-600">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
