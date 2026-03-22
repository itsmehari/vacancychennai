import { homeFaqItems } from "@/lib/home-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in";
const logoUrl = process.env.NEXT_PUBLIC_SITE_LOGO_URL;

export function buildHomeJsonLdGraph() {
  const website: Record<string, unknown> = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Vacancy Chennai",
    url: siteUrl,
    description:
      "Hyperlocal job listings for Chennai — browse by area, category, segment, and quick apply.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/jobs-in-chennai?category={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Vacancy Chennai",
    url: siteUrl,
    ...(logoUrl ? { logo: logoUrl } : {}),
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: homeFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [website, organization, faqPage],
  };
}
