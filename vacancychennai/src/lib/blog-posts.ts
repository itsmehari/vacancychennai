import { resumeDoctorReferralUrl } from "@/lib/partner-resumedoctor";

export type BlogFaqItem = { question: string; answer: string };

export type BlogSectionCallout = {
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
};

export type BlogSectionTable = {
  caption: string;
  columns: string[];
  rows: string[][];
};

export type BlogSection = {
  id: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: BlogSectionTable;
  callout?: BlogSectionCallout;
  faq?: BlogFaqItem[];
};

/** Optional client widgets inserted by `BlogArticleBody` at a fixed anchor section. */
export type BlogPostInteractive = "omr-hiring-playbook";

export type BlogPost = {
  slug: string;
  title: string;
  teaser: string;
  publishedAt: string;
  readMinutes: number;
  /** Legacy flat body; use when `sections` is omitted. */
  paragraphs: string[];
  /** Structured sections with TOC — preferred for long-form guides. */
  sections?: BlogSection[];
  interactive?: BlogPostInteractive;
  /** Contextual hubs for internal depth + CTR to listings. */
  relatedHubLinks?: { href: string; label: string }[];
  /** Optional ResumeDoctor retrofit block (retrofit placements / pillar-adjacent). */
  resumeDoctorRetrofitAside?: {
    utmContent: string;
    headline?: string;
    body?: string;
    linkLabel?: string;
    disclosure?: boolean;
  };
};

/** Plain text for JSON-LD `articleBody` and word count. */
export function getBlogPostArticleBody(post: BlogPost): string {
  if (post.sections?.length) {
    const chunks: string[] = [];
    for (const s of post.sections) {
      chunks.push(s.heading);
      if (s.paragraphs?.length) chunks.push(...s.paragraphs);
      if (s.bullets?.length) chunks.push(...s.bullets);
      if (s.table) {
        chunks.push(s.table.caption, ...s.table.columns, ...s.table.rows.flat());
      }
      if (s.callout) {
        chunks.push(s.callout.title, s.callout.body);
        if (s.callout.linkLabel) chunks.push(s.callout.linkLabel);
      }
      if (s.faq?.length) {
        for (const f of s.faq) {
          chunks.push(f.question, f.answer);
        }
      }
    }
    return chunks.filter(Boolean).join("\n\n");
  }
  return post.paragraphs.join("\n\n");
}

export const blogPosts: BlogPost[] = [
  {
    slug: "chennai-job-search-with-ats-ready-resume",
    title: "Chennai job search: ATS-ready resumes before your first click",
    teaser:
      "How Chennai candidates pass portal parsers, keep CVs truthful for moderated boards, then browse Vacancy Chennai for area-first openings — plus when a builder like ResumeDoctor saves time.",
    publishedAt: "2026-05-03",
    readMinutes: 16,
    paragraphs: [],
    relatedHubLinks: [
      { href: "/jobs-in-chennai", label: "All jobs in Chennai" },
      { href: "/freshers-jobs-chennai", label: "Freshers & entry-level" },
      { href: "/part-time-jobs-chennai", label: "Part-time jobs" },
      { href: "/job-seeker-profile", label: "Job seeker profile" },
    ],
    sections: [
      {
        id: "why-ats-first",
        heading: "Why ATS still gatekeeps Chennai applications",
        paragraphs: [
          "Even when recruiters care about hustle and references, applicant tracking systems ingest your file first. Parsing engines choke on cramped tables, header-footers reused as grids, icons masquerading as bullet points, and skill clouds that bury the keywords you actually verified.",
          "For Indian portals plus employer career pages you should assume a deterministic layout: headings that match recruiter expectations (“Experience”, “Education”, “Projects”), chronological clarity, measurable outcomes, and one column for OCR stability on mobile-heavy screening stacks.",
          "Chennai hires move across IT corridors, GCC back offices, hospitality, clinics, logistics, retail, and field marketing. Not every ATS uses the same weighting yet all reward honest structure over decoration.",
        ],
      },
      {
        id: "hyperlocal-discovery",
        heading: "After the CV is stable — search like a Chennai commuter",
        paragraphs: [
          "Vacancy Chennai is optimised for commuters who mentally map Tambaram Metro, Pallavaram–Thoraipakkam traffic, Porur junctions, Ambattur radial roads, Velachery links, OMR clusters, GST Road industrial belts, Perungudi shuttles.",
          "When you pivot from “anywhere in Chennai” to a concrete commute story, moderated employers see fewer ghost applies.",
        ],
        bullets: [
          "Bookmark moderated hyperlocal hubs before shotgun applying.",
          "Use your profile headline to echo neighbourhoods you can sustain week on week.",
        ],
      },
      {
        id: "truth-discipline",
        heading: "Balance keywords with audit-friendly truth",
        paragraphs: [
          "Mirror JD vocabulary only where you defended it in interviews. Mention tooling, languages, ticketing stacks faithfully and keep certification claims verifiable.",
        ],
      },
      {
        id: "builder-callout-primary",
        heading: "When ResumeDoctor helps",
        paragraphs: [
          "If layout friction steals rehearsal time for outcomes, offload canvas + bullet scaffolding before returning here.",
        ],
        callout: {
          title: "Structured draft in minutes",
          body:
            "ResumeDoctor specialises in ATS-friendly canvases tuned for Indian portals plus AI-assisted bullets and score checks — useful when Chennai listings demand specificity fast.",
          href: resumeDoctorReferralUrl("blog_pillar_resume"),
          linkLabel: "Open ResumeDoctor (ATS resume builder)",
        },
      },
      {
        id: "portal-rhythm",
        heading: "Naukri, LinkedIn, and hyperlocal boards",
        paragraphs: [
          "Refresh headline and headline skills between interview rounds. Maintain one truthful master CV synced to Vacancy Chennai quick apply so moderation screens align with PDF dates.",
          "Customise keywords per recruiter but avoid conflicting employers or overlapping notice-period claims.",
        ],
      },
      {
        id: "freshers-shift",
        heading: "Freshers versus experienced pivots",
        bullets: [
          "Students: quantify labs, OSS commits, internships, hackathons—not decorative icons.",
          "Career changers: surface transferable workflows Chennai HR teams recognise.",
          "Returning workforce: explain gaps succinctly—clarity outweighs omission.",
        ],
      },
      {
        id: "faq-candidates",
        heading: "Quick FAQ",
        faq: [
          {
            question: "Do I upload identical résumés everywhere?",
            answer:
              "Keep one truthful timeline while tailoring summaries; contradictory dates silently fail ATS + employer audits.",
          },
          {
            question: "Should I cram every acronym from each JD?",
            answer:
              "Only keep tokens anchored in shipped work—the OMR interviewing loop drills fast.",
          },
          {
            question: "How often refresh?",
            answer:
              "After each milestone project, credential, or locality pivot so hyperlocal recruiters trust timelines.",
          },
        ],
      },
      {
        id: "builder-callout-second",
        heading: "Check twice before uploading",
        paragraphs: [
          "Run ATS heuristics, human proofreading, then return to Vacancy Chennai with crisp commute rationale in each note.",
        ],
        callout: {
          title: "Score journeys before blasting portals",
          body:
            "ResumeDoctor publishes ATS tooling so Chennai seekers iterate before moderated submissions.",
          href: resumeDoctorReferralUrl("blog_pillar_resume_templates"),
          linkLabel: "Try ResumeDoctor ATS tooling",
        },
      },
    ],
  },
  {
    slug: "top-it-companies-hiring-omr",
    title: "Top IT companies hiring along OMR",
    teaser:
      "A recruiter’s playbook for the Chennai IT corridor: micro-locations, salary transparency, shift clarity, and how hyperlocal boards reduce noise — plus local context from the OMR community.",
    publishedAt: "2026-01-15",
    readMinutes: 14,
    paragraphs: [],
    interactive: "omr-hiring-playbook",
    sections: [
      {
        id: "introduction",
        heading: "Who this guide is for",
        paragraphs: [
          "If you run talent acquisition, lead a growing team along the Old Mahabalipuram Road (OMR), or own a business that depends on tech and back-office hires in South Chennai, this article is written for you. The corridor is crowded with employers — which means candidates scroll fast, compare commutes in their heads, and ghost interviews when the basics are unclear.",
          "Below we break down how hiring actually works on the ground: how people search, what makes a listing credible, and how to align your posts with hyperlocal behaviour so you spend less time screening misfits and more time closing the right people.",
        ],
      },
      {
        id: "why-omr-matters",
        heading: "Why OMR still concentrates hiring",
        paragraphs: [
          "OMR remains one of Chennai’s densest belts for IT services, GCC captives, product teams, and shared support functions. Office clusters, shuttles, and food-court ecosystems mean many candidates already live or rent along the corridor — but that does not make hiring automatic.",
          "Competition shows up as total reward, shift fit, hybrid policy, and commute predictability. Candidates routinely trade a slightly higher offer for a site they can reach without two hours in traffic. Your job post is often their first signal of whether you understand that reality.",
        ],
        bullets: [
          "Expect sharp questions on reporting location, not just “Chennai”.",
          "Night-shift and weekend-rotational roles need explicit week-off language to avoid drop-offs after offer.",
          "Hybrid policies should state minimum on-site days per week where applicable — vague “flexible” copy increases no-shows.",
        ],
      },
      {
        id: "how-candidates-search",
        heading: "How candidates search before they read your JD",
        paragraphs: [
          "On mobile, most job seekers filter by area, salary band, and job type before they open a full description. Many think in landmarks: a metro stop, a stretch between two junctions, or a well-known IT park name. Posts that only say “Chennai” force them to guess — and guessing usually means skipping your listing.",
          "Micro-locations such as Sholinganallur, Perungudi, Karapakkam, or Thoraipakkam help applicants self-select for commute. That specificity is not “SEO gaming”; it is respect for their time and yours.",
        ],
      },
      {
        id: "generic-vs-hyperlocal",
        heading: "Generic labels vs hyperlocal posts",
        table: {
          caption: "What applicants infer from your location line",
          columns: ["Typical listing line", "Candidate reaction", "Hiring outcome"],
          rows: [
            [
              "“Chennai” only",
              "Unclear commute; assumes worst case",
              "More unqualified applies or immediate bounce",
            ],
            [
              "“OMR” without pin or micro-area",
              "Slightly better; still wide corridor",
              "Mixed quality; more screening load",
            ],
            [
              "Campus / micro-area + transport cues",
              "Fast mental map; realistic self-filter",
              "Fewer, better-matched applies",
            ],
          ],
        },
      },
      {
        id: "posting-mistakes",
        heading: "Where employer posts lose trust",
        bullets: [
          "Salary hidden behind “as per industry standards” — top talent often never clicks apply.",
          "Senior title with junior tasks buried three screens down — generates resentment in round one.",
          "“Urgent hiring” with no interview window or contact turnaround — reads as volume spam.",
          "Mandatory on-site requirement only revealed at interview — damages brand in tight-knit OMR networks.",
          "Copy-paste JDs from another city without adjusting shift, language, or compliance context for Tamil Nadu operations.",
        ],
      },
      {
        id: "vacancy-chennai-fit",
        heading: "Why hyperlocal boards exist",
        paragraphs: [
          "Vacancy Chennai is built around area-first browsing and moderated listings so both sides see fewer junk posts and clearer expectations. Quick apply and structured fields are meant to reduce friction for candidates who already decided the corridor works for them — your role is to meet them with transparent basics.",
          "When your post matches how people actually search, you are not narrowing the funnel arbitrarily; you are pre-qualifying on commute and shift fit, which are often harder to change than a skill gap.",
        ],
      },
      {
        id: "local-context-myomr",
        heading: "Local context beyond job boards",
        paragraphs: [
          "Hiring managers who understand neighbourhood rhythm tend to write better posts. Traffic patterns, new metro links, and community life along the corridor all shape whether a role feels doable day to day.",
          "For that wider local lens — area guides, schools, civic and business updates tied to the OMR stretch — many teams pair hiring outreach with community sources. MyOMR.in covers the OMR locality as a news and discovery network; it is a useful bookmark when you want candidates (and new joiners) to see the corridor as a place, not only an office park.",
        ],
        callout: {
          title: "Explore the OMR locality",
          body:
            "MyOMR.in publishes local coverage and area-focused updates relevant to people living and working along the corridor. Use it alongside your hiring campaigns when you want grounded context for “why this location” in conversations with candidates.",
          href: "https://myomr.in",
          linkLabel: "Visit myomr.in",
        },
      },
      {
        id: "job-post-blueprint",
        heading: "A practical job-post blueprint",
        paragraphs: [
          "Lead with information that lets someone decide in thirty seconds. You can still attach a longer JD — but the opening block should stand alone.",
        ],
        bullets: [
          "Role level (years or band) and team type: product, ER&D, support, BPO, GCC, etc.",
          "Primary stack or process: languages, ticketing, QA type, cloud exposure — whatever is non-negotiable.",
          "Exact work location or approved micro-areas; mention shuttle gates or metro if you rely on them.",
          "Shift, week-off pattern, and hybrid/on-site minimums in plain language.",
          "In-hand or CTC band (min–max); note variables only if you explain them.",
          "Single apply path plus expected response time (e.g. “we reply within 3 business days”).",
        ],
      },
      {
        id: "shift-hybrid",
        heading: "Shift, hybrid, and back-to-office reality",
        paragraphs: [
          "OMR hiring still spans heavy rotational shifts in operations and daylight-centric product engineering in the same postcode. Candidates compare your policy with their current employer’s — often a ten-minute conversation at tea break — so ambiguity costs you scheduled interviews.",
          "If policy is still evolving, say what is fixed today (“three days on-site”) and what is under review, instead of leaving a blank. Honesty preserves pipeline quality more than aspirational wording.",
        ],
      },
      {
        id: "localized-seo",
        heading: "Localized discoverability (without keyword stuffing)",
        bullets: [
          "Put the micro-area once in the title or first line; repeat naturally in location fields, not in every bullet.",
          "Use the language candidates type: “Perungudi walk-in”, “Sholinganallur Java”, “OMR night shift” — mirror real queries.",
          "Refresh posts when salary bands or hybrid rules change; stale pins erode trust and waste screening hours.",
          "Close filled roles promptly so aggregators and boards do not train seekers to ignore your brand.",
        ],
      },
      {
        id: "faq",
        heading: "FAQ for hiring teams on OMR",
        faq: [
          {
            question: "Should we list salary even if internal policy is cautious?",
            answer:
              "A band beats silence. If you must use a range, mark what drives variance (shift premium, certification). Candidates who cannot accept the floor self-filter; that saves everyone time.",
          },
          {
            question: "We hire for multiple towers in the same campus — how specific should we be?",
            answer:
              "Name the campus and gate or block if security routing differs. If roles are identical across towers, one post with an optional line (“may report to Building X or Y”) is clearer than three near-duplicate ads.",
          },
          {
            question: "Do hyperlocal boards replace LinkedIn or referrals?",
            answer:
              "They complement them. Referrals bring trust; hyperlocal boards catch active commuters already filtering by area. Use both, but keep the same facts in each channel to avoid mixed messages.",
          },
          {
            question: "How does MyOMR.in relate to posting on Vacancy Chennai?",
            answer:
              "They serve different jobs: Vacancy Chennai is for moderated, area-first job discovery; MyOMR.in is a local network for news and place-based context. Together they help you speak credibly about work location and community.",
          },
        ],
      },
      {
        id: "takeaways",
        heading: "Key takeaways",
        bullets: [
          "Treat micro-location and shift clarity as part of compensation storytelling, not footnotes.",
          "Salary transparency and honest hybrid rules reduce noise faster than extra screening rounds.",
          "Pair job posts with local context — MyOMR.in is one reference point for life along OMR.",
          "Use moderated hyperlocal boards to match how Chennai candidates already browse.",
        ],
      },
    ],
    resumeDoctorRetrofitAside: {
      utmContent: "blog_omr_playbook",
      headline: "Résumés your pipeline receives",
      body:
        "Recruiters on OMR still receive PDFs from national portals — when you ask candidates to re-upload on Vacancy Chennai, point seekers to ATS-safe layouts via ResumeDoctor so screening stays consistent.",
      linkLabel: "Share ResumeDoctor with candidates",
      disclosure: true,
    },
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
    resumeDoctorRetrofitAside: {
      utmContent: "blog_walkins",
      headline: "Queue-day paperwork",
      body:
        "Before you haul copies to Tambaram corridors or OMR campuses, export an ATS-stable résumé with clear dates and Chennai-friendly references.",
      linkLabel: "Polish résumé on ResumeDoctor",
      disclosure: true,
    },
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
    resumeDoctorRetrofitAside: {
      utmContent: "blog_salary_2026",
      headline: "Back numbers with bullets",
      body:
        "When you pitch for a stretch band near OMR GCC teams or Tambaram warehouses, quantify outcomes so HR teams see CV proof—ResumeDoctor’s bullet coach helps quantify fast.",
      linkLabel: "Quantify bullets on ResumeDoctor",
      disclosure: true,
    },
  },
];
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
