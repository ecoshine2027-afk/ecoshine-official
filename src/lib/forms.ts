/** Result of a public form submission (contact + quote). Kept in a plain
    module so it can be shared between the "use server" action file and the
    client form components — "use server" files may only export async functions. */
export type SubmitState = { ok: boolean; error?: string };

/** Honeypot field name — hidden from real users; if a submission fills it, we
    treat it as a bot and silently drop it. Shared so the client forms and the
    server actions agree on the name. */
export const HONEYPOT_FIELD = "company_website";
