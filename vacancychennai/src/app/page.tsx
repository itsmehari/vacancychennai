import HomeBlogCta from "@/components/home/home-blog-cta";
import HomeCandidatesJoin from "@/components/home/home-candidates-join";
import HomeCategoryChips from "@/components/home/home-category-chips";
import HomeEmployerPricingStrip from "@/components/home/home-employer-pricing-strip";
import HomeEmployersMarketing from "@/components/home/home-employers-marketing";
import HomeFaq from "@/components/home/home-faq";
import HomeHero from "@/components/home/home-hero";
import HomeHowItWorks from "@/components/home/home-how-it-works";
import HomeJobSection from "@/components/home/home-job-section";
import HomeLocationGrid from "@/components/home/home-location-grid";
import HomeSegmentCards from "@/components/home/home-segment-cards";
import HomeShowcaseBento from "@/components/home/home-showcase/home-showcase-bento";
import HomeTrustPillars from "@/components/home/home-trust-pillars";
import { FALLBACK_CATEGORY_LABELS } from "@/features/core/mock-db";
import {
  getEmployerCompanyNameMap,
  listLocations,
  listPublishedJobs,
  resolveEmployerDisplayNameForJob,
} from "@/features/core/repository";
import { buildHomeJsonLdGraph } from "@/lib/home-jsonld";
import { formatTopChennaiAreasLine } from "@/lib/home-top-areas";
import { uniqueCategoriesFromJobs } from "@/lib/job-filters";
import { homePageMetadata } from "@/lib/seo";

export const metadata = homePageMetadata();

function formatShowcasePostedLabel(iso: string): string {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 86400000),
  );
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  if (days < 7) return `Posted ${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "Posted 1 week ago" : `Posted ${weeks} weeks ago`;
}

export default async function Home() {
  const [published, locations, employerNames] = await Promise.all([
    listPublishedJobs(),
    listLocations(),
    getEmployerCompanyNameMap(),
  ]);

  const locationsById = new Map(locations.map((l) => [l.id, l]));

  const featuredJobs = published
    .filter((j) => j.featured)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
  const featuredIds = new Set(featuredJobs.map((j) => j.id));
  const sortedPublished = [...published].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const latestJobs = sortedPublished.filter((j) => !featuredIds.has(j.id)).slice(0, 6);

  const categoriesRaw = uniqueCategoriesFromJobs(published);
  const categories =
    categoriesRaw.length > 0 ? categoriesRaw : [...FALLBACK_CATEGORY_LABELS];
  const jobCount = published.length;
  const areaCount = locations.length;

  const showcaseFeatured = featuredJobs[0];
  const showcaseJob =
    showcaseFeatured ??
    sortedPublished[0];
  const showcaseEmployerName = showcaseJob
    ? await resolveEmployerDisplayNameForJob(showcaseJob)
    : undefined;
  const showcaseLocation = showcaseJob ? locationsById.get(showcaseJob.locationId) : undefined;

  const jsonLd = buildHomeJsonLdGraph();
  const dynamicAreaInsight = formatTopChennaiAreasLine(published, locations, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col gap-0">
        <HomeHero
          jobCount={jobCount}
          areaCount={areaCount}
          categories={categories}
          locations={locations}
          dynamicAreaInsight={dynamicAreaInsight}
        />
        {showcaseJob && showcaseLocation ? (
          <HomeShowcaseBento
            job={showcaseJob}
            employerName={showcaseEmployerName ?? "Local employer"}
            location={showcaseLocation}
            postedLabel={formatShowcasePostedLabel(showcaseJob.createdAt)}
          />
        ) : null}
        <HomeSegmentCards />
        <HomeCategoryChips categories={categories} />
        <HomeLocationGrid locations={locations} />
        <HomeJobSection
          sectionId="featured"
          variant="featured"
          title="Featured jobs"
          description="Chennai employers boosting visibility — real micro-locations highlighted."
          jobs={featuredJobs}
          viewAllHref="/jobs-in-chennai"
          dataCtaViewAll="view-all-featured"
          employerNames={employerNames}
          locationsById={locationsById}
        />
        {latestJobs.length > 0 ? (
          <HomeJobSection
            sectionId="latest"
            variant="latest"
            title="Latest jobs"
            description="Recently published listings across Chennai."
            jobs={latestJobs}
            viewAllHref="/jobs-in-chennai"
            dataCtaViewAll="view-all-latest"
            employerNames={employerNames}
            locationsById={locationsById}
          />
        ) : null}
        <HomeHowItWorks />
        <HomeEmployerPricingStrip />
        <HomeEmployersMarketing />
        <HomeCandidatesJoin />
        <HomeFaq />
        <HomeTrustPillars />
        <HomeBlogCta />
      </div>
    </>
  );
}
