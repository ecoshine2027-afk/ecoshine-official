"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  FileText,
  Newspaper,
  Images,
  Briefcase,
  Settings,
  SprayCan,
  Building2,
  Quote,
  HelpCircle,
  BadgeCheck,
  Inbox,
  Info,
  MapPin,
  Search,
  Scale,
  Menu,
  type LucideIcon,
} from "lucide-react";

type NavLink = { href: string; label: string; icon: LucideIcon };

const groups: { heading?: string; links: NavLink[] }[] = [
  {
    links: [
      { href: "/ecoshine_admin_panel", label: "Dashboard", icon: LayoutDashboard },
      { href: "/ecoshine_admin_panel/enquiries", label: "Enquiries", icon: Inbox },
    ],
  },
  {
    heading: "Content",
    links: [
      { href: "/ecoshine_admin_panel/homepage", label: "Homepage", icon: Home },
      { href: "/ecoshine_admin_panel/about", label: "About Page", icon: Info },
      { href: "/ecoshine_admin_panel/pages", label: "Page Titles", icon: FileText },
      { href: "/ecoshine_admin_panel/legal", label: "Legal Pages", icon: Scale },
      { href: "/ecoshine_admin_panel/services", label: "Services", icon: SprayCan },
      { href: "/ecoshine_admin_panel/sectors", label: "Sectors", icon: Building2 },
      { href: "/ecoshine_admin_panel/service-areas", label: "Service Areas", icon: MapPin },
    ],
  },
  {
    heading: "Collections",
    links: [
      { href: "/ecoshine_admin_panel/blog", label: "Blog", icon: Newspaper },
      { href: "/ecoshine_admin_panel/gallery", label: "Gallery", icon: Images },
      { href: "/ecoshine_admin_panel/jobs", label: "Jobs", icon: Briefcase },
      { href: "/ecoshine_admin_panel/testimonials", label: "Testimonials", icon: Quote },
      { href: "/ecoshine_admin_panel/faqs", label: "FAQs", icon: HelpCircle },
      { href: "/ecoshine_admin_panel/logos", label: "Trusted Logos", icon: BadgeCheck },
    ],
  },
  {
    heading: "Setup",
    links: [
      { href: "/ecoshine_admin_panel/navigation", label: "Navigation & Footer", icon: Menu },
      { href: "/ecoshine_admin_panel/seo", label: "SEO & Metadata", icon: Search },
      { href: "/ecoshine_admin_panel/settings", label: "Settings", icon: Settings },
    ],
  },
];

const ENQUIRIES_HREF = "/ecoshine_admin_panel/enquiries";

export function AdminNav({ unreadEnquiries = 0 }: { unreadEnquiries?: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {groups.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-1">
          {group.heading && (
            <p className="px-3.5 pb-1 pt-4 text-[11px] font-bold uppercase tracking-wider text-muted">
              {group.heading}
            </p>
          )}
          {group.links.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === "/ecoshine_admin_panel"
                ? pathname === "/ecoshine_admin_panel"
                : pathname.startsWith(link.href);
            const showBadge = link.href === ENQUIRIES_HREF && unreadEnquiries > 0;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 rounded-btn px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  active ? "bg-brand-600 text-white" : "text-foreground hover:bg-surface-2"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{link.label}</span>
                {showBadge && (
                  <span
                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                      active ? "bg-white/25 text-white" : "bg-red-500 text-white"
                    }`}
                  >
                    {unreadEnquiries > 99 ? "99+" : unreadEnquiries}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
