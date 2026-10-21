import { siteUrlRoot } from "@/lib/job-posting-jsonld";
import type { DiscoverFaq } from "@/lib/discover/roles";

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const root = siteUrlRoot();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? `${root}/` : `${root}${item.path}`,
    })),
  };
}

export function faqPageJsonLd(items: DiscoverFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function howToJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  steps: { name: string; text: string }[];
}) {
  const root = siteUrlRoot();
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    url: `${root}${opts.path}`,
    step: opts.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function collectionPageJsonLd(opts: { name: string; description: string; path: string }) {
  const root = siteUrlRoot();
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: `${root}${opts.path}`,
    isPartOf: { "@type": "WebSite", name: "Vacancy Chennai", url: root },
  };
}

export function definedTermSetJsonLd(
  terms: { name: string; description: string }[],
  path: string,
) {
  const root = siteUrlRoot();
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Vacancy Chennai hiring glossary",
    url: `${root}${path}`,
    hasDefinedTerm: terms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.name,
      description: term.description,
    })),
  };
}
