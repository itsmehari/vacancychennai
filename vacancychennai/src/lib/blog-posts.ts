export type BlogPost = {
  slug: string;
  title: string;
  teaser: string;
  publishedAt: string;
  readMinutes: number;
  /** Plain-text paragraphs for the article body */
  paragraphs: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "top-it-companies-hiring-omr",
    title: "Top IT companies hiring along OMR",
    teaser: "What to expect when hiring along the IT corridor — and how hyperlocal boards help.",
    publishedAt: "2026-01-15",
    readMinutes: 6,
    paragraphs: [
      "The Old Mahabalipuram Road (OMR) corridor remains one of Chennai’s densest hiring zones for technology and back-office roles. Employers compete not only on salary but on commute, shift flexibility, and clarity in job posts.",
      "For local hiring, candidates often search by landmark and area before they read the full description. Listings that name the micro-location — Sholinganallur vs Perungudi, for example — tend to get faster qualified applies than generic “Chennai” labels.",
      "Vacancy Chennai is built for that behaviour: area-first browse, moderated listings, and quick apply so applicants are not forced through long forms before they know the role fits.",
      "If you are hiring on OMR, lead with role level, stack or process (support, testing, development), shift, and in-hand salary bands. That transparency reduces mismatched applications and saves your team screening time.",
    ],
  },
  {
    slug: "walk-in-jobs-chennai-this-week",
    title: "Walk-in jobs in Chennai: how they fit a local board",
    teaser: "Walk-ins are still a Chennai staple — here is how to list them responsibly online.",
    publishedAt: "2026-02-02",
    readMinutes: 5,
    paragraphs: [
      "Walk-in drives remain popular for retail, logistics, BPO, and volume hiring. Online, the same events need dates, venue, ID requirements, and a single point of contact — otherwise candidates arrive unprepared or at the wrong gate.",
      "A good walk-in post states the date range, reporting time window, exact address or campus name, dress code if any, and what to bring (Aadhaar, education proofs, passport photos). Pin the neighbourhood so people can judge commute realistically.",
      "On Vacancy Chennai, treat walk-ins like any other listing: clear location, moderated copy, and a way to apply or register if you want a headcount before the day. That keeps quality high for both sides.",
      "After the drive, close or pause the listing so job seekers are not sent to expired venues — it protects your brand and their time.",
    ],
  },
  {
    slug: "salary-trends-chennai-2026",
    title: "Salary trends in Chennai (2026) — practical bands",
    teaser: "Rough monthly in-hand bands by role type for local employers setting expectations.",
    publishedAt: "2026-03-10",
    readMinutes: 7,
    paragraphs: [
      "Salary conversations in Chennai still vary sharply by corridor, role, and shift. These bands are indicative for planning — not a substitute for your own market checks or internal grades.",
      "Entry-level retail, front desk, and field roles often cluster in a lower band; skilled trades and night-shift BPO may sit higher within the same category. IT services and product roles on OMR and peripheral IT parks typically command different premiums than back-office support.",
      "Employers who publish a clear min–max range on the listing attract fewer mismatched applicants and set interview expectations early. Candidates, in turn, can filter by salary on the full Chennai board.",
      "Vacancy Chennai encourages honest ranges and local context (area, shift, language needs) so both sides spend less time on roles that were never going to match.",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
