"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { overviewLinks, exploreLinks, type NavItem } from "@/lib/site";
import { resolveIcon } from "@/lib/icons";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { QuoteButton } from "@/components/quote/quote-button";
import type { LucideIcon } from "lucide-react";

/* Overview/Explore children keep code-defined icons; service and sector
   children carry an icon key (from the icon registry) that is resolved at
   render time, so admin-added items show their chosen icon too. */
// Keyed by href (stable) rather than label, so renaming a menu item in the
// admin keeps its icon.
const iconByHref: Record<string, LucideIcon> = Object.fromEntries([
  ...overviewLinks.map((l) => [l.href, l.icon]),
  ...exploreLinks.map((l) => [l.href, l.icon]),
]);

function childIcon(child: {
  label: string;
  href: string;
  slug?: string;
  icon?: string;
}): LucideIcon | undefined {
  if (child.icon || child.slug) return resolveIcon(child.icon);
  return iconByHref[child.href];
}

export function Navbar({
  nav,
  phone,
  phoneHref,
}: {
  nav: NavItem[];
  phone: string;
  phoneHref: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change and lock body scroll while open.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Link colours adapt: dark/brand inside the scrolled pill, white over the
  // transparent hero at the top.
  const linkCls = (active: boolean) =>
    `inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
      scrolled
        ? active
          ? "text-brand-600 dark:text-brand-300"
          : "text-foreground hover:text-brand-600 dark:hover:text-brand-300"
        : active
          ? "text-white"
          : "text-white/85 hover:text-white"
    }`;

  const burgerCls = scrolled
    ? "border-border bg-card text-foreground hover:bg-surface-2"
    : "border-white/25 bg-white/10 text-white hover:bg-white/20";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
        {/* Subtle top scrim keeps the white nav readable over bright heroes;
            fades out once the solid pill takes over. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent transition-opacity duration-300 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* The bar: full-width + transparent at the top, a centred floating pill
            once scrolled. */}
        <div
          className={`relative rounded-full border transition-all duration-300 ease-out ${
            scrolled
              ? "mt-2.5 w-[min(68rem,calc(100%-1.5rem))] border-border bg-background/80 shadow-lg shadow-black/5 backdrop-blur-md"
              : "mt-0 w-full border-transparent bg-transparent shadow-none"
          }`}
        >
          <nav
            className={`grid grid-cols-[1fr_auto_1fr] items-center gap-2 transition-all duration-300 ${
              scrolled ? "h-14 px-3 sm:px-5" : "container-page h-16 lg:h-20"
            }`}
          >
            {/* Left: logo */}
            <div className="col-start-1 flex items-center justify-self-start">
              <Logo light={!scrolled} />
            </div>

            {/* Centre: desktop menus */}
            <ul className="col-start-2 hidden items-center justify-center gap-0.5 justify-self-center lg:flex">
              {nav.map((item) =>
                item.children ? (
                  <li key={item.label} className="group relative">
                    <Link href={item.href} className={linkCls(isActive(item.href))}>
                      {item.label}
                      <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    </Link>
                    <div className="invisible absolute left-1/2 top-full w-[42rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-5 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                      <div className="rounded-card border border-border bg-card p-3 shadow-lg shadow-black/5">
                        <p className="px-1.5 pb-2 text-xs font-bold uppercase tracking-wide text-muted">
                          {item.label}
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                          {item.children.slice(0, 7).map((child) => {
                            const ChildIcon = childIcon(child);
                            return (
                              <Link
                                key={child.label}
                                href={child.href}
                                className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-surface-2"
                              >
                                {ChildIcon && (
                                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
                                    <ChildIcon className="h-5 w-5" />
                                  </span>
                                )}
                                <span className="min-w-0">
                                  <span className="block text-sm font-semibold text-foreground">
                                    {child.label}
                                  </span>
                                  {child.description && (
                                    <span className="mt-0.5 block text-xs leading-snug text-muted">
                                      {child.description}
                                    </span>
                                  )}
                                </span>
                              </Link>
                            );
                          })}
                          {item.children.length > 7 && (
                            <Link
                              href={item.href}
                              className="flex items-center justify-center gap-1.5 rounded-lg p-2.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-surface-2 dark:text-brand-300"
                            >
                              View all {item.href.replace("/", "")}
                              <ChevronDown className="h-4 w-4 -rotate-90" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={item.label}>
                    <Link href={item.href} className={linkCls(isActive(item.href))}>
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>

            {/* Right: actions */}
            <div className="col-start-3 flex items-center justify-end gap-2 justify-self-end">
              <ThemeToggle light={!scrolled} />
              <QuoteButton size="sm" className="hidden lg:inline-flex">
                Get a Free Quote
              </QuoteButton>
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={open}
                onClick={() => setOpen(true)}
                className={`inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-btn border transition-colors lg:hidden ${burgerCls}`}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile slide-in menu - kept OUTSIDE <header> so the header's
          backdrop-blur (a containing block for fixed elements) never clips it. */}
      <div
        className={`fixed inset-0 z-[60] isolate lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full max-h-dvh w-[88%] max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <Logo />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-btn border border-border bg-card text-foreground"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="flex flex-col gap-1">
              {nav.map((item) =>
                item.children ? (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenLabel((v) => (v === item.label ? null : item.label))
                      }
                      className="flex w-full cursor-pointer items-center justify-between rounded-btn px-3 py-3 text-base font-medium text-foreground"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          openLabel === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openLabel === item.label && (
                      <ul className="ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              className="block rounded-btn px-3 py-2.5 text-sm text-muted transition-colors hover:text-brand-600"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`block rounded-btn px-3 py-3 text-base font-medium transition-colors hover:text-brand-600 ${
                        isActive(item.href)
                          ? "text-brand-600 dark:text-brand-300"
                          : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="border-t border-border p-4">
            <QuoteButton
              size="lg"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Get a Free Quote
            </QuoteButton>
            <a
              href={phoneHref}
              className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-muted"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
