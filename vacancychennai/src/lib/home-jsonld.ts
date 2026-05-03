import { homeFaqItems } from "@/lib/home-content";
import { HOME_SCHEMA_DESCRIPTION, HOME_SEO_TITLE } from "@/lib/home-seo-copy";
import { organizationSameAsUrls } from "@/lib/site-social";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in";
const logoUrl = process.env.NEXT_PUBLIC_SITE_LOGO_URL;

const chennaiAreaServed = {
  "@type": "City",
  name: "Chennai",
  containedInPlace: {
    "@type": "State",
    name: "Tamil Nadu",
    containedInPlace: {
      "@type": "Country",
      name: "India",
    },
  },
};

export function buildHomeJsonLdGraph() {
  const website: Record<string, unknown> = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Vacancy Chennai",
    url: siteUrl,
    inLanguage: "en-IN",
    description: HOME_SCHEMA_DESCRIPTION,
    publisher: { "@id": `${siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      name: "Search jobs by category",
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
    description: HOME_SCHEMA_DESCRIPTION,
    areaServed: chennaiAreaServed,
    ...(logoUrl ? { logo: logoUrl } : {}),
    ...(() => {
      const same = organizationSameAsUrls();
      return same.length ? { sameAs: same } : {};
    })(),
  };

  const webPage: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage`,
    url: `${siteUrl}/`,
    name: HOME_SEO_TITLE,
    description: HOME_SCHEMA_DESCRIPTION,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    mainEntity: { "@id": `${siteUrl}/#website` },
    ...(logoUrl
      ? { primaryImageOfPage: { "@type": "ImageObject", url: logoUrl } }
      : {}),
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
    "@graph": [organization, website, webPage, faqPage],
  };
}
