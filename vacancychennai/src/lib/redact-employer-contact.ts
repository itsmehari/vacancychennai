const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const TEL_RE = /tel:\+?[\d\s()-]{8,}/gi;
const WA_RE = /wa\.me\/\d+/gi;
/** Indian mobiles, with or without +91, including a 91 prefix stuck to 10 digits. */
const PHONE_RE = /(?:\+?\s*91[\s.-]*)?[6-9](?:[\s.-]*\d){9}\b|\b91[6-9]\d{9}\b/g;

const HIDDEN = "hidden until you register";

/** Strip employer emails and phone numbers from public job text. */
export function redactEmployerContacts(text: string): string {
  return text
    .replace(TEL_RE, `tel:${HIDDEN}`)
    .replace(WA_RE, `wa.me/${HIDDEN}`)
    .replace(EMAIL_RE, `[email ${HIDDEN}]`)
    .replace(PHONE_RE, `[phone ${HIDDEN}]`);
}

export function employerContactsRedacted(original: string, redacted: string): boolean {
  return original !== redacted;
}
