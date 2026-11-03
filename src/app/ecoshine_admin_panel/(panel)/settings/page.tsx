import { getSettings } from "@/lib/content";
import { saveSettingsAction } from "@/app/ecoshine_admin_panel/actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { cardCls, inputCls, labelCls, primaryBtnCls, textareaCls } from "@/components/admin/ui";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
      <p className="mt-1 text-sm text-muted">
        Contact details, social links, opening hours and the footer text. Used across the
        whole site.
      </p>
      <SavedBanner saved={saved} error={error} />

      <form action={saveSettingsAction} className="mt-6 space-y-4">
        <fieldset className={cardCls}>
          <legend className="px-1 text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300">
            Contact
          </legend>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className={labelCls}>
                Phone
              </label>
              <input id="phone" name="phone" type="tel" required defaultValue={settings.phone} className={inputCls} />
            </div>
            <div>
              <label htmlFor="phoneSecondary" className={labelCls}>
                Secondary phone (optional)
              </label>
              <input
                id="phoneSecondary"
                name="phoneSecondary"
                defaultValue={settings.phoneSecondary}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelCls}>
                Email
              </label>
              <input id="email" name="email" type="email" required defaultValue={settings.email} className={inputCls} />
            </div>
            <div>
              <label htmlFor="website" className={labelCls}>
                Website
              </label>
              <input id="website" name="website" type="url" placeholder="https://..." defaultValue={settings.website} className={inputCls} />
            </div>
            <div>
              <label htmlFor="whatsapp" className={labelCls}>
                WhatsApp link
              </label>
              <input id="whatsapp" name="whatsapp" type="url" defaultValue={settings.whatsapp} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className={labelCls}>
                Address / Location
              </label>
              <input id="address" name="address" required defaultValue={settings.address} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="mapEmbed" className={labelCls}>
                Google Maps embed URL (optional)
              </label>
              <input
                id="mapEmbed"
                name="mapEmbed"
                type="url"
                placeholder="https://www.google.com/maps/embed?pb=..."
                defaultValue={settings.mapEmbed}
                className={inputCls}
              />
              <p className="mt-1 text-xs text-muted">
                In Google Maps: Share → Embed a map → copy the <code>src</code> URL from the iframe. Shown on the Contact page.
              </p>
            </div>
          </div>
        </fieldset>

        <fieldset className={cardCls}>
          <legend className="px-1 text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300">
            Location Coordinates (GEO)
          </legend>
          <p className="mt-2 text-xs text-muted">
            Used in the site&apos;s LocalBusiness structured data so Google Maps and local search
            pin your business accurately. Find them by right-clicking your location in Google Maps —
            the first number is the latitude, the second the longitude.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="latitude" className={labelCls}>
                Latitude
              </label>
              <input
                id="latitude"
                name="latitude"
                inputMode="decimal"
                placeholder="-33.833"
                defaultValue={settings.latitude}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="longitude" className={labelCls}>
                Longitude
              </label>
              <input
                id="longitude"
                name="longitude"
                inputMode="decimal"
                placeholder="151.047"
                defaultValue={settings.longitude}
                className={inputCls}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className={cardCls}>
          <legend className="px-1 text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300">
            Social Media
          </legend>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="facebook" className={labelCls}>
                Facebook URL
              </label>
              <input id="facebook" name="facebook" type="url" placeholder="https://facebook.com/..." defaultValue={settings.social.facebook === "#" ? "" : settings.social.facebook} className={inputCls} />
            </div>
            <div>
              <label htmlFor="instagram" className={labelCls}>
                Instagram URL
              </label>
              <input id="instagram" name="instagram" type="url" placeholder="https://instagram.com/..." defaultValue={settings.social.instagram === "#" ? "" : settings.social.instagram} className={inputCls} />
            </div>
            <div>
              <label htmlFor="linkedin" className={labelCls}>
                LinkedIn URL
              </label>
              <input id="linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/company/..." defaultValue={settings.social.linkedin === "#" ? "" : settings.social.linkedin} className={inputCls} />
            </div>
          </div>
        </fieldset>

        <fieldset className={cardCls}>
          <legend className="px-1 text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300">
            Opening Hours
          </legend>
          <div className="mt-2 space-y-3">
            {settings.hours.map((h, i) => (
              <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={`hours-day-${i}`} className={labelCls}>
                    Days
                  </label>
                  <input id={`hours-day-${i}`} name={`hours-day-${i}`} defaultValue={h.day} className={inputCls} />
                </div>
                <div>
                  <label htmlFor={`hours-time-${i}`} className={labelCls}>
                    Hours
                  </label>
                  <input id={`hours-time-${i}`} name={`hours-time-${i}`} defaultValue={h.time} className={inputCls} />
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className={cardCls}>
          <legend className="px-1 text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300">
            Footer
          </legend>
          <div className="mt-2">
            <label htmlFor="footerBlurb" className={labelCls}>
              Footer description
            </label>
            <textarea
              id="footerBlurb"
              name="footerBlurb"
              defaultValue={settings.footerBlurb}
              className={`${textareaCls} min-h-20`}
            />
          </div>
        </fieldset>

        <button type="submit" className={primaryBtnCls}>
          Save Settings
        </button>
      </form>
    </div>
  );
}
