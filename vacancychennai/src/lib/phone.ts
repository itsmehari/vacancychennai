/** Normalize Indian / international mobile to E.164 (+91…). */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s().-]/g, "");
  if (!digits) return null;
  if (digits.startsWith("+")) {
    return /^\+\d{10,15}$/.test(digits) ? digits : null;
  }
  if (/^\d{10}$/.test(digits)) return `+91${digits}`;
  if (/^\d{11,15}$/.test(digits)) return `+${digits}`;
  return null;
}

/** Display label for Indian mobiles (+91 98765 43210). */
export function formatPhoneLabel(e164: string): string {
  const m = e164.match(/^\+91(\d{5})(\d{5})$/);
  if (m) return `+91 ${m[1]} ${m[2]}`;
  return e164;
}

/** Digits only for wa.me (no +). */
export function phoneToWhatsAppDigits(e164: string): string {
  return e164.replace(/\D/g, "");
}
