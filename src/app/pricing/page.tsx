import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata(
  "Employer Pricing - Vacancy Chennai",
  "Simple local hiring pricing for Chennai employers.",
  "/pricing",
);

export default function PricingPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Employer Pricing</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border bg-white p-5">
          <h2 className="text-xl font-semibold">Basic</h2>
          <p className="mt-2 text-2xl font-bold">INR 99</p>
          <p className="mt-1 text-sm text-slate-700">Single job posting.</p>
        </article>
        <article className="rounded-lg border bg-white p-5">
          <h2 className="text-xl font-semibold">Featured</h2>
          <p className="mt-2 text-2xl font-bold">INR 299</p>
          <p className="mt-1 text-sm text-slate-700">Area-top featured listing.</p>
        </article>
        <article className="rounded-lg border bg-white p-5">
          <h2 className="text-xl font-semibold">Urgent Pack</h2>
          <p className="mt-2 text-2xl font-bold">INR 999</p>
          <p className="mt-1 text-sm text-slate-700">
            Urgent posting + assisted candidate calling.
          </p>
        </article>
      </div>
    </section>
  );
}

