import { phoneToWhatsAppDigits } from "@/lib/phone";

export function buildWhatsAppHref(phoneE164: string, message?: string): string {
  const digits = phoneToWhatsAppDigits(phoneE164);
  const base = `https://wa.me/${digits}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function defaultJobRequestWhatsAppMessage(seekerName: string, areaLabel: string): string {
  return `Hi ${seekerName}, I saw your job request on Vacancy Chennai (${areaLabel}). I'd like to discuss an opportunity with you.`;
}
