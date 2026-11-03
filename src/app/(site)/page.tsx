import { Hero } from "@/components/home/hero";
import { ServicesGrid } from "@/components/home/services-grid";
import { WhyChoose } from "@/components/home/why-choose";
import { OurDifference } from "@/components/home/our-difference";
import { AustraliaCoverage } from "@/components/home/australia-coverage";
import { HowItWorks } from "@/components/home/how-it-works";
import { SatisfactionBand } from "@/components/satisfaction-band";
import { WorkGallery } from "@/components/home/work-gallery";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { LeadCapture } from "@/components/home/lead-capture";
import { LocalBusinessJsonLd, WebsiteJsonLd, FaqJsonLd } from "@/components/json-ld";
import { getHomepage, getServices, getTestimonials, getFaqs } from "@/lib/content";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home");
}

export default async function HomePage() {
  const [homepage, services, testimonials, faqs] = await Promise.all([
    getHomepage(),
    getServices(),
    getTestimonials(),
    getFaqs(),
  ]);
  // Services are fully serializable now (icon is a string key), so they pass
  // straight to the client grid — icons resolve there via the registry.
  const plainServices = services;
  const serviceNames = services.map((s) => ({ slug: s.slug, short: s.short }));

  // A section renders unless the admin has explicitly toggled it off.
  const show = (key: string) => homepage.visible[key] !== false;

  return (
    <>
      <LocalBusinessJsonLd />
      <WebsiteJsonLd />
      <FaqJsonLd faqs={faqs} />
      <Hero />
      {show("services") && (
        <ServicesGrid services={plainServices} heading={homepage.services} />
      )}
      {show("whyChoose") && <WhyChoose content={homepage.whyChoose} />}
      {show("ourDifference") && <OurDifference content={homepage.ourDifference} />}
      {show("coverage") && (
        <AustraliaCoverage serviceNames={serviceNames} heading={homepage.coverage} />
      )}
      {show("howItWorks") && <HowItWorks content={homepage.howItWorks} />}
      {show("satisfaction") && <SatisfactionBand content={homepage.satisfaction} />}
      {show("gallery") && <WorkGallery heading={homepage.gallery} />}
      {show("testimonials") && (
        <Testimonials items={testimonials} heading={homepage.testimonials} />
      )}
      {show("faq") && <Faq heading={homepage.faq} />}
      {show("leadCapture") && <LeadCapture content={homepage.leadCapture} />}
    </>
  );
}
