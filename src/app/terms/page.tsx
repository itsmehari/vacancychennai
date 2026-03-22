import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata(
  "Terms of Use - Vacancy Chennai",
  "Terms of use for Vacancy Chennai.",
  "/terms",
);

export default function TermsPage() {
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold">Terms of Use</h1>
      <p className="mt-3 text-slate-700">
        This page is a placeholder. Replace with your full terms before production.
      </p>
    </section>
  );
}
