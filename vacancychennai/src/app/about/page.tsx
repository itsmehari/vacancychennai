import InnerPageHero from "@/components/marketing/inner-page-hero";
import { baseMetadata } from "@/lib/seo";
import { sectionCard } from "@/lib/ui";

export const metadata = baseMetadata(
  "About Vacancy Chennai",
  "Location-first hiring for Chennai and suburbs — moderated listings for safer local job search, quick apply for seekers, and simple tools for employers.",
  "/about",
);

export default function AboutPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="Company"
        title="About Vacancy Chennai"
        description="We focus on location-first hiring so people find work near home and employers reach nearby talent — across Chennai and suburbs."
      />
      <div className="space-y-6 pb-4 pt-8">
        <section className={sectionCard}>
          <h2 className="text-lg font-semibold text-slate-900">Our mission</h2>
          <p className="mt-2 leading-relaxed text-slate-700">
            Vacancy Chennai is built for faster local placements: clear areas and landmarks, moderated
            listings, and quick apply so candidates are not stuck in long forms on day one.
          </p>
        </section>
        <section className={sectionCard}>
          <h2 className="text-lg font-semibold text-slate-900">Who it is for</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700">
            <li>Job seekers browsing by neighbourhood, category, or role type</li>
            <li>Employers hiring in Chennai — from retail and logistics to IT corridors</li>
            <li>Teams who want simpler workflows than national boards tuned for metros only</li>
          </ul>
        </section>
      </div>
    </>
  );
}
