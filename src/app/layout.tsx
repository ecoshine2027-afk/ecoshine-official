import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { site, seoKeywords } from "@/lib/site";
import { getSettings } from "@/lib/content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const DEFAULT_DESCRIPTION =
  "Eco-friendly commercial & office cleaning across Sydney and Australia. Insured, police-checked, eco-certified teams. No lock-in contracts — free quotes within 2 hours.";
const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Ecoshine Solution — eco-friendly commercial cleaning across Sydney and Australia",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const name = settings.name || site.name;
  // Keep the keyword-rich default headline, but swap in the live business name.
  const defaultTitle = `Commercial Cleaning Sydney & Australia | ${name}`;
  return {
    metadataBase: new URL(site.url),
    title: {
      default: defaultTitle,
      template: `%s | ${name}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: seoKeywords,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_AU",
      url: site.url,
      siteName: name,
      title: defaultTitle,
      description: DEFAULT_DESCRIPTION,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: DEFAULT_DESCRIPTION,
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${dmSans.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
