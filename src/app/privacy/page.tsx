import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata(
  "Privacy Policy - Vacancy Chennai",
  "Privacy policy for Vacancy Chennai.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-3 text-slate-700">
        This page is a placeholder. Replace with your full privacy policy before production.
      </p>
    </section>
  );
}
