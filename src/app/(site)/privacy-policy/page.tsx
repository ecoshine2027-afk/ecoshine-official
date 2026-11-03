import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getSettings } from "@/lib/content";
import { site } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("privacy-policy");
}

const LAST_UPDATED = "1 July 2026";

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle={`How ${site.legalName} collects, uses and protects your personal information.`}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />

      <section className="container-page py-14 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-muted">Last updated: {LAST_UPDATED}</p>

          <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-muted [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
            <div>
              <p>
                {site.legalName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to
                protecting your privacy. This policy explains how we handle your personal
                information in accordance with the Australian Privacy Act 1988 (Cth) and the
                Australian Privacy Principles (APPs).
              </p>
            </div>

            <div>
              <h2>Information we collect</h2>
              <p>We may collect the following personal information:</p>
              <ul>
                <li>Your name, email address, phone number and postal or site address.</li>
                <li>Company or organisation details when you enquire on behalf of a business.</li>
                <li>Details of the cleaning services you request or receive.</li>
                <li>
                  Information you provide through our contact form, quote requests, phone calls
                  or emails.
                </li>
                <li>
                  Technical data such as your IP address and browser type when you visit our
                  website.
                </li>
              </ul>
            </div>

            <div>
              <h2>How we use your information</h2>
              <p>We use your personal information to:</p>
              <ul>
                <li>Respond to your enquiries and provide quotes.</li>
                <li>Schedule, deliver and manage our cleaning services.</li>
                <li>Process payments and maintain our business records.</li>
                <li>Communicate with you about your bookings and our services.</li>
                <li>Improve our website, services and customer experience.</li>
                <li>Comply with our legal and regulatory obligations.</li>
              </ul>
            </div>

            <div>
              <h2>Disclosure of your information</h2>
              <p>
                We do not sell your personal information. We may share it with trusted service
                providers who help us operate our business (such as payment processors and IT
                providers), or where required or authorised by law. Any third parties we engage
                are required to protect your information consistent with this policy.
              </p>
            </div>

            <div>
              <h2>Data security</h2>
              <p>
                We take reasonable steps to protect your personal information from misuse, loss,
                unauthorised access, modification or disclosure. However, no method of
                transmission over the internet is completely secure, and we cannot guarantee
                absolute security.
              </p>
            </div>

            <div>
              <h2>Access and correction</h2>
              <p>
                You may request access to the personal information we hold about you, or ask us
                to correct it if it is inaccurate. To make a request, or if you have a privacy
                complaint, please contact us using the details below and we will respond within a
                reasonable time.
              </p>
            </div>

            <div>
              <h2>Cookies</h2>
              <p>
                Our website may use cookies and similar technologies to remember your
                preferences and understand how the site is used. You can disable cookies in your
                browser settings, though some parts of the site may not function as intended.
              </p>
            </div>

            <div>
              <h2>Changes to this policy</h2>
              <p>
                We may update this policy from time to time. The latest version will always be
                available on this page, with the &quot;last updated&quot; date shown above.
              </p>
            </div>

            <div>
              <h2>Contact us</h2>
              <p>
                If you have any questions about this Privacy Policy or how we handle your
                personal information, please contact us:
              </p>
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
                <li>Location: {settings.address}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
