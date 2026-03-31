import type { Job, Location } from "@/types/domain";
import HomeSectionShell from "@/components/home/home-section-shell";
import SectionHeader from "@/components/home/section-header";
import ShowcaseAddSkillsCard from "./showcase-add-skills-card";
import ShowcaseBadgeCard from "./showcase-badge-card";
import ShowcaseInsightsCard from "./showcase-insights-card";
import ShowcaseJobCard from "./showcase-job-card";
import ShowcaseLocationCard from "./showcase-location-card";
import ShowcaseProfileCard from "./showcase-profile-card";
import ShowcaseTestimonialCard from "./showcase-testimonial-card";

export type HomeShowcaseBentoProps = {
  job: Job;
  employerName: string;
  location: Location;
  postedLabel: string;
};

export default function HomeShowcaseBento({
  job,
  employerName,
  location,
  postedLabel,
}: HomeShowcaseBentoProps) {
  return (
    <HomeSectionShell variant="tint" fullBleed className="home-showcase">
      <section aria-labelledby="platform-preview">
        <SectionHeader
          id="platform-preview"
          eyebrow="Platform preview"
          title="Everything you need to hire and get hired in Chennai"
          description="Explore how listings, profiles, local context, and trust signals come together—without leaving the homepage."
        />
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-6 xl:gap-5">
          <div className="md:col-span-2 xl:col-span-3 xl:row-span-2 xl:row-start-1">
            <ShowcaseJobCard
              job={job}
              employerName={employerName}
              location={location}
              postedLabel={postedLabel}
            />
          </div>
          <div className="md:col-span-2 xl:col-span-3 xl:row-span-2 xl:row-start-1 xl:col-start-4">
            <ShowcaseTestimonialCard />
          </div>
          <div className="md:col-span-1 xl:col-span-2 xl:row-start-3">
            <ShowcaseAddSkillsCard />
          </div>
          <div className="md:col-span-1 xl:col-span-4 xl:row-start-3 xl:col-start-3">
            <ShowcaseInsightsCard />
          </div>
          <div className="md:col-span-1 xl:col-span-2 xl:row-start-4">
            <ShowcaseProfileCard />
          </div>
          <div className="md:col-span-1 xl:col-span-2 xl:row-start-4 xl:col-start-3">
            <ShowcaseLocationCard location={location} />
          </div>
          <div className="md:col-span-2 xl:col-span-2 xl:row-start-4 xl:col-start-5">
            <ShowcaseBadgeCard />
          </div>
        </div>
      </section>
    </HomeSectionShell>
  );
}
