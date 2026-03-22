import HomeBlogCta from "@/components/home/home-blog-cta";
import HomeCandidatesJoin from "@/components/home/home-candidates-join";
import HomeCategoryChips from "@/components/home/home-category-chips";
import HomeEmployersMarketing from "@/components/home/home-employers-marketing";
import HomeFaq from "@/components/home/home-faq";
import HomeHero from "@/components/home/home-hero";
import HomeHowItWorks from "@/components/home/home-how-it-works";
import HomeJobSection from "@/components/home/home-job-section";
import HomeLocationGrid from "@/components/home/home-location-grid";
import HomeSegmentCards from "@/components/home/home-segment-cards";
import HomeStatsStrip from "@/components/home/home-stats-strip";
import HomeTrustPillars from "@/components/home/home-trust-pillars";
import {
  getCategoriesForHomeChips,
  getFeaturedPublishedJobs,
  getPublishedJobs,
  getPublishedJobsCount,
  locations,
} from "@/features/core/mock-db";
import { buildHomeJsonLdGraph } from "@/lib/home-jsonld";
import { homePageMetadata } from "@/lib/seo";

export const metadata = homePageMetadata();

export default function Home() {
  const featuredJobs = getFeaturedPublishedJobs(6);
  const featuredIds = new Set(featuredJobs.map((j) => j.id));
  const sortedPublished = [...getPublishedJobs()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const latestJobs = sortedPublished.filter((j) => !featuredIds.has(j.id)).slice(0, 6);

  const categories = getCategoriesForHomeChips();
  const jobCount = getPublishedJobsCount();
  const areaCount = locations.length;

  const jsonLd = buildHomeJsonLdGraph();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-12 md:space-y-16">
        <HomeHero />
        <HomeStatsStrip jobCount={jobCount} areaCount={areaCount} />
        <HomeSegmentCards />
        <HomeCategoryChips categories={categories} />
        <HomeLocationGrid locations={locations} />
        <HomeJobSection
          sectionId="featured"
          title="Featured jobs"
          description="Highlighted roles from local employers."
          jobs={featuredJobs}
          viewAllHref="/jobs-in-chennai"
          dataCtaViewAll="view-all-featured"
        />
        {latestJobs.length > 0 ? (
          <HomeJobSection
            sectionId="latest"
            title="Latest jobs"
            description="Recently published listings across Chennai."
            jobs={latestJobs}
            viewAllHref="/jobs-in-chennai"
            dataCtaViewAll="view-all-latest"
          />
        ) : null}
        <HomeHowItWorks />
        <HomeEmployersMarketing />
        <HomeCandidatesJoin />
        <HomeFaq />
        <HomeTrustPillars />
        <HomeBlogCta />
      </div>
    </>
  );
}
