import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getSettings } from "@/lib/content";
import { site } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("terms");
}

const LAST_UPDATED = "1 July 2026";

export default async function TermsPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        title="Terms & Conditions"
        subtitle={`The terms that apply when you book cleaning services with ${site.legalName}.`}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Terms" }]}
      />

      <section className="container-page py-14 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-muted">Last updated: {LAST_UPDATED}</p>

          <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-muted [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
            <div>
              <p>
                These Terms &amp; Conditions govern the cleaning services provided by{" "}
                {site.legalName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By booking or
                using our services, you agree to these terms.
              </p>
            </div>

            <div>
              <h2>1. Quotes and bookings</h2>
              <p>
                Quotes are provided free of charge and are based on the information you give us
                about the site and the work required. If the actual scope differs materially from
                what was described, we may revise the quote before or during the job. A booking is
                confirmed once we have agreed the scope, price and schedule with you.
              </p>
            </div>

            <div>
              <h2>2. Pricing and payment</h2>
              <ul>
                <li>Prices are quoted in Australian dollars and are inclusive of GST where applicable.</li>
                <li>Invoices are payable by the due date stated on the invoice.</li>
                <li>
                  For ongoing services, pricing may be reviewed periodically with reasonable
                  notice to you.
                </li>
                <li>Late payments may incur reasonable recovery costs.</li>
              </ul>
            </div>

            <div>
              <h2>3. No lock-in contracts</h2>
              <p>
                We operate without lock-in contracts. You may start, pause or cancel ongoing
                services by giving us reasonable notice, as agreed at the time of booking.
              </p>
            </div>

            <div>
              <h2>4. Cancellations and rescheduling</h2>
              <p>
                We ask for at least 24 hours&apos; notice to cancel or reschedule a booked clean.
                Cancellations made with less notice, or where our team is unable to access the
                site at the agreed time, may incur a fee to cover the reserved labour.
              </p>
            </div>

            <div>
              <h2>5. Access and site conditions</h2>
              <p>
                You agree to provide safe and timely access to the site and to advise us of any
                hazards, security requirements or special instructions. We are not responsible for
                delays or incomplete work caused by a lack of access, utilities or unsafe
                conditions beyond our control.
              </p>
            </div>

            <div>
              <h2>6. Our satisfaction guarantee</h2>
              <p>
                If you are not satisfied with a clean, let us know within 24 hours and we will
                return to re-clean the affected areas at no additional cost. This guarantee covers
                the agreed scope of work.
              </p>
            </div>

            <div>
              <h2>7. Insurance and liability</h2>
              <p>
                We carry public liability insurance and our staff are police-checked. To the
                extent permitted by law, our liability is limited to re-performing the services or
                the cost of having the services re-performed. Nothing in these terms excludes any
                rights you have under the Australian Consumer Law.
              </p>
            </div>

            <div>
              <h2>8. Damage and claims</h2>
              <p>
                Any claim for loss or damage must be reported to us in writing within 48 hours of
                the service so we can investigate promptly. We are not liable for pre-existing
                damage or for items that are inherently fragile and were not disclosed to us.
              </p>
            </div>

            <div>
              <h2>9. Privacy</h2>
              <p>
                We handle your personal information in accordance with our{" "}
                <a href="/privacy-policy" className="font-medium text-brand-600 hover:underline dark:text-brand-300">
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            <div>
              <h2>10. Changes to these terms</h2>
              <p>
                We may update these terms from time to time. The current version will always be
                available on this page, with the &quot;last updated&quot; date shown above.
              </p>
            </div>

            <div>
              <h2>11. Contact us</h2>
              <ul>
                <li>
                  Email:{" "}
                  <a href={`mailto:${settings.email}`} className="font-medium text-brand-600 hover:underline dark:text-brand-300">
                    {settings.email}
                  </a>
                </li>
                <li>
                  Phone:{" "}
                  <a href={settings.phoneHref} className="font-medium text-brand-600 hover:underline dark:text-brand-300">
                    {settings.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
