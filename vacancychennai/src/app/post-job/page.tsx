import QuickJobPostForm from "@/components/marketing/quick-job-post-form";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata(
  "Post a job in Chennai — Vacancy Chennai",
  "Paste a Chennai vacancy in three steps: mobile number, email, and the job text. Every post is reviewed before it goes live.",
  "/post-job",
);

type Props = {
  searchParams: Promise<{ sent?: string; error?: string }>;
};

export default async function PostJobPage({ searchParams }: Props) {
  const query = await searchParams;

  return (
    <>
      <InnerPageHero
        eyebrow="Employers"
        title="Post a job in three steps"
        description="Enter your mobile number, your email, then paste the vacancy. No account needed."
      >
        <ul className="mt-5 max-w-lg space-y-2 text-sm text-slate-400 md:text-base">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden />
            Copy the same text you would send on WhatsApp.
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden />
            We review every post before it appears on the site.
          </li>
        </ul>
      </InnerPageHero>
      <div className="pb-16 pt-8">
        <QuickJobPostForm sent={query.sent === "1"} error={query.error} />
      </div>
    </>
  );
}
