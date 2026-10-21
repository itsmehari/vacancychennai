/** Ready posts for neighbourhood groups and a college/association ask. Sending stays with the person who has the group or the inbox. */

export function areaGroupPost(area: string, pageUrl: string): string {
  return [
    `Jobs in ${area} — open the live list, then apply on the job page. Vacancy Chennai does not charge candidates.`,
    pageUrl,
    "",
    `${area} பகுதி வேலைகள் இங்கே. வேலைப் பக்கத்திலேயே விண்ணப்பிக்கவும். கட்டணம் வேண்டாம்.`,
    pageUrl,
  ].join("\n");
}

export function collegeAsk(area: string, pageUrl: string): { subject: string; body: string } {
  const subject = `Link request: jobs in ${area}`;
  const body = [
    "Hello,",
    "",
    `Vacancy Chennai publishes moderated job listings for ${area}:`,
    pageUrl,
    "",
    "If your placement cell or association shares local openings, this page is the current list. Candidates are not charged a fee to apply.",
    "",
    "A link from your site or notice board to that URL helps people who study or live nearby.",
    "",
    "Vacancy Chennai",
    "support@vacancychennai.in",
  ].join("\n");
  return { subject, body };
}

export function whatsappShareHref(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function telegramShareHref(pageUrl: string, text: string): string {
  const params = new URLSearchParams({ url: pageUrl, text });
  return `https://t.me/share/url?${params.toString()}`;
}

export function mailtoShareHref(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
