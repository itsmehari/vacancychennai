import Link from "next/link";
import HomeSectionShell from "@/components/home/home-section-shell";
import JobCard from "@/components/job-card";
import SectionHeader from "@/components/home/section-header";
import type { Job } from "@/types/domain";
import { linkInline } from "@/lib/ui";

type SectionVariant = "featured" | "latest";

type Props = {
  sectionId: string;
  variant?: SectionVariant;
  title: string;
  description?: string;
  jobs: Job[];
  viewAllHref: string;
  dataCtaViewAll: string;
  employerNames?: Map<string, string>;
  locationsById?: Map<string, { area: string; zone: string }>;
};

export default function HomeJobSection({
  sectionId,
  variant = "latest",
  title,
  description,
  jobs,
  viewAllHref,
  dataCtaViewAll,
  employerNames,
  locationsById,
}: Props) {
  if (jobs.length === 0) return null;

  const headingId = `home-jobs-${sectionId}`;
  const isFeatured = variant === "featured";

  const viewAll = (
    <Link
      href={viewAllHref}
      className={`${linkInline} min-h-[44px] inline-flex items-center gap-1 py-2 text-sm font-semibold`}
      data-cta={dataCtaViewAll}
    >
      View all jobs
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );

  const inner = (
    <section
      className={`space-y-8 ${isFeatured ? "my-2 rounded-[var(--radius-lg)] border border-amber-200/80 bg-gradient-to-b from-amber-50/50 to-transparent p-6 md:my-4 md:p-8" : ""}`}
      aria-labelledby={headingId}
    >
      <SectionHeader
        id={headingId}
        eyebrow={isFeatured ? "Spotlight" : "Fresh listings"}
        title={title}
        description={description}
        action={viewAll}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => {
          const loc = locationsById?.get(job.locationId);
          return (
            <JobCard
              key={job.id}
              job={job}
              variant={isFeatured ? "spotlight" : "default"}
              employerCompanyName={employerNames?.get(job.employerId)}
              locationArea={loc?.area}
              locationZone={loc?.zone}
            />
          );
        })}
      </div>
    </section>
  );

  if (isFeatured) return inner;

  return (
    <HomeSectionShell variant="elevated" fullBleed>
      {inner}
    </HomeSectionShell>
  );
}
