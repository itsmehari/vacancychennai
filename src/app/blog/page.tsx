import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata(
  "Hiring Insights - Vacancy Chennai",
  "Local Chennai hiring trends and practical employer guides.",
  "/blog",
);

const posts = [
  {
    slug: "top-it-companies-hiring-omr",
    title: "Top IT Companies Hiring in OMR",
  },
  {
    slug: "walk-in-jobs-chennai-this-week",
    title: "Walk-in Jobs Chennai This Week",
  },
  {
    slug: "salary-trends-chennai-2026",
    title: "Salary Trends Chennai 2026",
  },
];

export default function BlogIndexPage() {
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold">Hiring Insights</h1>
      <ul className="mt-4 space-y-2">
        {posts.map((post) => (
          <li key={post.slug} className="rounded border p-3">
            {post.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

