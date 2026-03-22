import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata(
  "About Vacancy Chennai",
  "Hyperlocal hiring mission for Chennai employers and job seekers.",
  "/about",
);

export default function AboutPage() {
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold">About Vacancy Chennai</h1>
      <p className="mt-3 text-slate-700">
        Vacancy Chennai is a location-first hiring platform designed for faster local
        placements across Chennai and suburbs.
      </p>
    </section>
  );
}

