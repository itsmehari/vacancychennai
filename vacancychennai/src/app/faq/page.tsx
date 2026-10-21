import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import { DiscoverFaqList } from "@/components/discover/discover-faq-list";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { extraFaqItems } from "@/lib/discover/hubs";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/discover/jsonld";
import { homeFaqItems } from "@/lib/home-content";
import { baseMetadata } from "@/lib/seo";

const title = "Vacancy Chennai FAQ";
const description =
  "Answers about applying, accounts, moderation, areas, salaries, and how to cite a Chennai listing.";

export const metadata = baseMetadata(title, description, "/faq");

export default function FaqPage() {
  const items = [...homeFaqItems, ...extraFaqItems];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(items)) }} />
      <InnerPageHero
        eyebrow="Help"
        title="Questions and answers"
        description="The same answers are written on this page so people and answer engines can quote them without inventing policy."
      />
      <div className="py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/faq", label: "FAQ" },
          ]}
        />
        <DiscoverFaqList items={items} heading="All answers" />
      </div>
    </>
  );
}
