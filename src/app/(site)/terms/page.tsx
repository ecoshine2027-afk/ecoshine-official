import type { Metadata } from "next";
import { getSettings, getLegalPage } from "@/lib/content";
import { LegalPageView } from "@/components/legal-page";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("terms");
}

export default async function TermsPage() {
  const [settings, page] = await Promise.all([getSettings(), getLegalPage("terms")]);
  return <LegalPageView page={page} settings={settings} crumbLabel="Terms" />;
}
