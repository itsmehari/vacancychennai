import InnerPageHero from "@/components/marketing/inner-page-hero";
import Link from "next/link";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, btnSecondary, linkInline, sectionCard } from "@/lib/ui";

export const metadata = baseMetadata(
  "Contact Vacancy Chennai",
  "Reach the Vacancy Chennai team for employer support, job seeker questions, or feedback on listings and moderation.",
  "/contact",
);

export default function ContactPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="Support"
        title="Contact us"
        description="Questions about posting, pricing, or your account? Reach the team — we read every message."
      />
      <div className="pb-4 pt-8">
        <section className={sectionCard}>
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</dt>
              <dd className="mt-1">
                <a href="mailto:support@vacancychennai.in" className={linkInline}>
                  support@vacancychennai.in
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">WhatsApp</dt>
              <dd className="mt-1 text-slate-800">+91-90000-00000</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <Link href="/jobs-in-chennai" className={btnPrimary}>
              Browse jobs
            </Link>
            <Link href="/post-job" className={btnSecondary}>
              Post a job
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
