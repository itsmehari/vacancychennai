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
  /** Quiet internal links after section body (navigation + SEO). */
  crossLinks?: { href: string; label: string }[];
  /** Single subtle line — use sparingly (e.g. employer pricing). */
  softPromo?: { body: string; href: string; linkLabel: string };
};

/** Optional client widgets inserted by `BlogArticleBody` at a fixed anchor section. */
export type BlogPostInteractive = "omr-hiring-playbook" | "first-resume-playbook";

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
      if (s.crossLinks?.length) {
        chunks.push(...s.crossLinks.map((c) => `${c.label} ${c.href}`));
      }
      if (s.softPromo) {
        chunks.push(s.softPromo.body, s.softPromo.linkLabel);
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
    slug: "first-resume-students-homemakers-chennai",
    title: "Your first résumé in Chennai: students, homemakers, and career restarters",
    teaser:
      "The full playbook: 16 sections on structure, mindset, education and gap language, Chennai commute reality, ATS-safe files, interactive checklists, and what to do the day you hit apply — built for college goers, homemakers, and anyone drafting a CV for the first time.",
    publishedAt: "2026-05-04",
    readMinutes: 24,
    interactive: "first-resume-playbook",
    paragraphs: [],
    relatedHubLinks: [
      { href: "/jobs-in-chennai", label: "All jobs in Chennai" },
      { href: "/freshers-jobs-chennai", label: "Freshers & entry-level" },
      { href: "/part-time-jobs-chennai", label: "Part-time & flexible" },
      { href: "/job-seeker-profile", label: "Job seeker profile" },
      { href: "/candidate/register", label: "Create candidate account" },
      { href: "/employer/login", label: "Employer login" },
      { href: "/post-job", label: "Post a job" },
      { href: "/pricing", label: "Employer pricing" },
      { href: "/subscribe", label: "Email job alerts" },
      { href: "/contact", label: "Contact" },
    ],
    sections: [
      {
        id: "who-this-is-for",
        heading: "Who this deep guide is for",
        paragraphs: [
          "This is for you if you are building a résumé for the first time — or the first time in a long time. Typical readers are final-year college students, fresh graduates, homemakers and caregivers returning to paid work, people who moved to Chennai for family, gig workers formalising experience, and career restarters after a break or a pivot.",
          "You might feel pressure to sound “corporate.” The stronger move is to sound clear: what you did, with what tools, for whom, and what changed because of it. Recruiters along OMR, in GCC back offices, in retail across GST Road, in clinics and logistics hubs, skim fast. Your job is to survive that skim without exaggeration.",
          "Vacancy Chennai lists moderated, area-aware roles. When your CV and your profile here tell the same story, employers spend less time guessing — and you spend less energy chasing mismatched interviews.",
        ],
        crossLinks: [
          { href: "/job-seeker-profile", label: "Job seeker profile" },
          { href: "/jobs-in-chennai", label: "Browse Chennai jobs" },
          { href: "/candidate/register", label: "Create candidate account" },
        ],
      },
      {
        id: "why-structure-beats-glamour",
        heading: "Why structure beats glamour (especially on Indian portals)",
        paragraphs: [
          "Applicant tracking systems ingest text before a human admires your colour palette. Fancy templates with multi-column layouts, skill meters, and icon bullets often scramble parsing — which means your “Experience” section may land in the wrong bucket or disappear.",
          "A plain one-column page with familiar headings — Summary, Education, Experience, Skills — is not boring; it is legible. Legibility is how you get to the human round in Chennai’s volume hiring markets.",
          "When you later customise for a dream employer, you still keep one master timeline. Contradictory dates between PDF, portal profile, and moderated boards trigger silent red flags — not because you meant to mislead, but because busy applicants typo years.",
        ],
        bullets: [
          "Headings recruiters expect: Education, Experience, Projects or Training, Skills — not cute synonyms buried in design.",
          "One column, left-aligned body text, standard fonts (Arial, Calibri, system defaults).",
          "Save as PDF unless the employer insists on Word — preserves layout across devices.",
        ],
        crossLinks: [
          { href: "/jobs-in-chennai", label: "Chennai job board" },
          { href: "/subscribe", label: "Email job alerts" },
        ],
      },
      {
        id: "mindset-truth-over-fluff",
        heading: "Mindset: truth scales better than adjectives",
        paragraphs: [
          "Replace “hard-working team player” with work: “Supported weekend inventory at X shop — cut stock discrepancies by coordinating hand counts with the supervisor.” If you do not have paid outcomes yet, use academic or volunteer outcomes with the same discipline.",
          "You are not filling space — you are evidence-mapping. Every bullet should answer: what did I do, with what tool or context, and what happened next?",
          "Chennai interview loops often include practical questions for entry roles: typing speed, basic Excel, shift timing, spoken English vs Tamil for customer-facing jobs. Your CV should not claim tools you cannot demo — screening catches disconnects quickly.",
        ],
        crossLinks: [
          { href: "/freshers-jobs-chennai", label: "Freshers & entry-level" },
          { href: "/part-time-jobs-chennai", label: "Part-time & flexible" },
        ],
      },
      {
        id: "contact-line-and-consistency",
        heading: "Contact block, IDs, and date discipline",
        bullets: [
          "Full name as it appears on school/college certificates and government ID.",
          "Phone number with country code; email you check twice daily — no outdated university mailbox if you have graduated.",
          "City and state (e.g. Chennai, Tamil Nadu). Pin code optional; full street address usually unnecessary on page one.",
          "LinkedIn or portfolio only when populated — empty shells hurt more than they help.",
        ],
        paragraphs: [
          "Align degree years with transcripts, internship dates with offer letters or emails you can produce, and job titles with relieving letters when you have them. Moderated boards and employers sometimes spot-check — inconsistency reads worse than a modest role.",
        ],
        crossLinks: [
          { href: "/job-seeker-profile", label: "Sync your online profile" },
          { href: "/candidate/login", label: "Candidate login" },
        ],
      },
      {
        id: "headline-and-summary-that-scan",
        heading: "Headline and summary that survive a 10-second skim",
        paragraphs: [
          "Your headline is one line under your name: target lane plus anchor proof. Examples: “Diploma in Civil — site internship @ metro corridor project” or “B.Com (Corp.) — Tally + GST coursework; seeking accounts trainee”. Avoid poetic quotes — they burn precious pixels.",
          "A three-line summary works when it answers: who you are professionally, what you want next, and one proof point. For restarters, add a crisp pivot line: “Returning to full-time admin roles after a caregiving break — refreshed Excel + ERP coursework in 2026.”",
          "Use Tamil Nadu–relevant signals only when true: languages spoken, willingness for night shift in BPO, two-wheeler commute if field sales, district preference without sounding rigid.",
        ],
        crossLinks: [
          { href: "/freshers-jobs-chennai", label: "Freshers hiring hub" },
          { href: "/jobs-in-chennai", label: "All Chennai jobs" },
        ],
      },
      {
        id: "education-and-credentials-freshers",
        heading: "Education, marks, and certifications — what to include",
        paragraphs: [
          "List your highest credential first, then previous schooling if early-career. Include board/university name, location, year of passing, and field of study. CGPA or percentage is optional — include if strong or if the employer explicitly asks in campus pipelines.",
          "Short courses matter when verifiable: NISM, Tally MSME workshops, NIELIT basics, spoken-English modules with dates and providers. Skip unattributed “certificates” from unknown PDF mills.",
          "If you are still pursuing a degree, say “Pursuing — expected YYYY” so recruiters do not assume you already hold the qualification.",
        ],
        crossLinks: [
          { href: "/freshers-jobs-chennai", label: "Entry-level listings" },
          { href: "/candidate/register", label: "Sign up to apply" },
        ],
      },
      {
        id: "projects-internships-and-campus-proof",
        heading: "Projects, internships, NSS, and campus proof",
        paragraphs: [
          "Treat internships like mini jobs: company or department, city, month–month dates, three bullets with verbs. If stipend-free but structured, label “Internship (stipend unpaid)” — honesty protects you in background conversations.",
          "Academic projects belong in Experience or a Projects section. Format: problem statement in one line, your role, tools (Python, Fusion 360, survey tools), outcome (“prototype demo to faculty panel”, “dataset of n records”).",
          "NSS, Rotaract, cultural fest leadership: include when it shows reliability and teamwork — not as filler. One bullet with scope beats five generic club mentions.",
        ],
        crossLinks: [
          { href: "/job-seeker-profile", label: "Add skills to your profile" },
          { href: "/freshers-jobs-chennai", label: "First-job listings" },
        ],
      },
      {
        id: "homemakers-gaps-without-oversharing",
        heading: "Homemakers and caregivers: gaps without oversharing",
        paragraphs: [
          "A career break is common. On the résumé, one composed line is enough: “Career break — full-time caregiving (20XX–20XX)” or “Family responsibilities — now seeking part-time admin / retail scheduling.” Long essays invite bias and waste space.",
          "You choose how much personal detail to carry into interviews. The CV’s job is neutral clarity — not your whole story.",
          "If you took micro-courses during the break, surface them in Education or Professional development — dated and specific.",
        ],
        crossLinks: [
          { href: "/part-time-jobs-chennai", label: "Part-time & flex jobs" },
          { href: "/jobs-in-chennai", label: "All local listings" },
        ],
      },
      {
        id: "transferable-skills-from-home-and-community",
        heading: "Transferable skills from home, tuition, and community work",
        paragraphs: [
          "Rewrite unpaid labour into capabilities employers recognise — without inventing job titles. Budgeting → cash handling awareness; vendor coordination → stakeholder follow-up; apartment association treasurer → basic bookkeeping cadence; tuition batches → training delivery and punctuality.",
        ],
        table: {
          caption: "Plain-language home work → résumé-ready phrasing (examples)",
          columns: ["Your reality", "Neutral bullet idea"],
          rows: [
            [
              "Managed monthly groceries + utilities within a fixed budget",
              "Managed recurring household budgets and vendor payouts — tracked expenses against monthly plan",
            ],
            [
              "Ran tuition for two neighbourhood children",
              "Delivered structured lessons for primary maths / English — prepared weekly plans and progress notes",
            ],
            [
              "Led colony flood-relief volunteer roster",
              "Coordinated volunteer shifts and supply distribution for a 40-family ward initiative",
            ],
            [
              "Helped in family kirana / textile shop during weekends",
              "Supported retail counter — billing, stock display, and peak-hour customer queries",
            ],
          ],
        },
        crossLinks: [
          { href: "/part-time-jobs-chennai", label: "Flexible & shift-friendly roles" },
          { href: "/jobs-in-chennai", label: "Search by area & salary" },
        ],
      },
      {
        id: "skills-and-keywords-you-can-defend",
        heading: "Skills, keywords, and tools — only what you can defend",
        bullets: [
          "List Excel only if you can sort, filter, basic formulas, and maybe pivot on demand.",
          "Languages: “Tamil — native; English — professional working proficiency” if accurate — avoid inflated CEFR claims.",
          "Typing speed matters for data-entry and voice blended roles — test once, cite WPM truthfully.",
          "Do not keyword-stuff from random JDs; Indian HR panels often probe tools line-by-line in first rounds.",
        ],
        crossLinks: [
          { href: "/jobs-in-chennai", label: "Live Chennai openings" },
          { href: "/subscribe", label: "Get new matches by email" },
        ],
      },
      {
        id: "format-ats-pdf-mistakes",
        heading: "ATS-friendly files — what breaks parsers",
        paragraphs: [
          "Tables for layout, text boxes in Word, headers with critical contact info only, footers with page counts — parsers misread these. Put name and phone in the body, not only in the header.",
          "Graphics as skill bars waste space and confuse OCR on mobile-driven screening stacks. Use plain bullets.",
          "File name hygiene: FirstName_LastName_Resume.pdf — not Resume_final_FINAL.pdf — signals professionalism in shared drives.",
        ],
        bullets: [
          "Prefer one PDF export from Word/LibreOffice/Google Docs — not stitched screenshots.",
          "Font size 10–12 pt body; margins normal; black text on white for fax/print tracks still used in some SMB hiring.",
        ],
        crossLinks: [
          { href: "/job-seeker-profile", label: "Keep profile aligned with your PDF" },
          { href: "/candidate/register", label: "Register to save applications" },
        ],
      },
      {
        id: "chennai-commute-shifts-languages",
        heading: "Chennai commute, shifts, and language realism",
        paragraphs: [
          "Employers care whether you can sustain the commute — not whether you love the city. Mentioning “based in Ambattur — open to Porur / Anna Nagar corridors” helps scheduling teams plan interviews faster than “Chennai” alone.",
          "Night-shift BPO, retail Sundays, healthcare rotations — state availability plainly when true. It filters mismatch early.",
          "For customer-facing roles in Chennai and suburbs, bilingual Tamil + English is often the default expectation — note it when fluent.",
        ],
        crossLinks: [
          { href: "/jobs-in-chennai", label: "Filter by area & type" },
          { href: "/part-time-jobs-chennai", label: "Evening & weekend shifts" },
        ],
      },
      {
        id: "hyperlocal-search-vacancy-chennai",
        heading: "Why hyperlocal search on Vacancy Chennai after your CV is ready",
        paragraphs: [
          "National aggregators spread noise: duplicate posts, unclear micro-locations, scam patterns. A Chennai-first board with moderated listings lets you filter salary honesty, job type, and area fit — closer to how you already plan commutes.",
          "Create your job seeker profile here so quick-apply flows reuse consistent basics; fewer typos across repeated forms.",
        ],
        callout: {
          title: "Browse by area and salary band",
          body:
            "When your headline matches realistic geography and shift tolerance, start with the full Chennai board — then narrow into freshers or part-time hubs if that matches your lane.",
          href: "/jobs-in-chennai",
          linkLabel: "Explore jobs in Chennai",
        },
        crossLinks: [
          { href: "/freshers-jobs-chennai", label: "Freshers hub" },
          { href: "/part-time-jobs-chennai", label: "Part-time hub" },
          { href: "/subscribe", label: "Subscribe to alerts" },
        ],
        softPromo: {
          body:
            "Hiring for your team? Moderated, hyperlocal listings use straightforward employer plans — compare tiers before you publish.",
          href: "/pricing",
          linkLabel: "Employer pricing",
        },
      },
      {
        id: "red-flags-employers-notice",
        heading: "Red flags employers and moderators notice fast",
        bullets: [
          "Date overlaps that are impossible (two full-time degrees simultaneously without explanation).",
          "Employer names that sound like household brands but your bullet describes unrelated tasks — specificity fixes this.",
          "Gmail handles are fine; gibberish handles are not. Create a clean alias if needed.",
          "“References on request” is dated — better to line up two mentors who agreed beforehand.",
        ],
        crossLinks: [
          { href: "/contact", label: "Question for our team?" },
          { href: "/about", label: "About Vacancy Chennai" },
        ],
      },
      {
        id: "from-cv-to-first-message",
        heading: "From CV export to first application message",
        paragraphs: [
          "Before you mass-apply, pick five target employers whose commute and shift you can honour for six months — energy beats spray-and-pray.",
          "Customise the opening paragraph of your cover note or application box: one sentence on the role, one on proof, one on locality or availability.",
          "After each interview, update your master CV with new skills or corrections — your future self saves hours.",
        ],
        bullets: [
          "Save role-specific CV copies with filenames that include company slug + date — version chaos kills interviews.",
          "Track where you applied (sheet or notes) so follow-ups stay honest when recruiters cross-check.",
        ],
        crossLinks: [
          { href: "/jobs-in-chennai", label: "Apply to Chennai listings" },
          { href: "/employer/login", label: "Employer dashboard" },
          { href: "/post-job", label: "Post a new role" },
        ],
        softPromo: {
          body:
            "Recruiting alongside reading this guide? Publish a role and choose visibility when you need faster reach — see plans and post in one flow.",
          href: "/pricing",
          linkLabel: "Pricing & listing options",
        },
      },
      {
        id: "faq-first-resume-expanded",
        heading: "FAQ — first résumé, gaps, and Chennai hiring",
        faq: [
          {
            question: "I have never earned a salary. Is my Experience section empty?",
            answer:
              "No — populate it with internships, structured volunteering, freelance gigs you can explain, and labelled academic projects. Use a Projects subsection if that reads cleaner.",
          },
          {
            question: "Should I mention marriage or children?",
            answer:
              "Not required for ability to do the job. If you choose to explain a gap, keep it professional and brief — interviews can go deeper if you want.",
          },
          {
            question: "How long should my first résumé be?",
            answer:
              "One page is the default for students and many restarters; move to two pages only when you have several years of relevant paid roles worth detailing.",
          },
          {
            question: "Can homemakers apply to full-time roles directly?",
            answer:
              "Yes, when stamina and logistics fit — but many successful restarts stack part-time or flex roles first to rebuild confidence and references. Vacancy Chennai lists both.",
          },
          {
            question: "Do I need English fluency for every Chennai job?",
            answer:
              "No — warehouse, manufacturing support, and some retail lanes privilege Tamil; many hybrid roles need workable English. Mirror what the JD stresses.",
          },
          {
            question: "Should I pay someone to “SEO” my CV with keywords?",
            answer:
              "Save your money for verified courses. Keyword stuffing without lived experience fails human screens and wastes interview airtime.",
          },
          {
            question: "What if I only have a mobile phone — no laptop?",
            answer:
              "Use free mobile-friendly doc editors, export PDF, and ask a trusted friend for a second pair of eyes on spelling. Library or browsing centres can help for one clean export if needed.",
          },
        ],
        crossLinks: [
          { href: "/contact", label: "Contact" },
          { href: "/subscribe", label: "Job alert emails" },
          { href: "/blog", label: "More hiring guides" },
        ],
      },
    ],
    resumeDoctorRetrofitAside: {
      utmContent: "blog_first_resume",
      headline: "Layout without guesswork",
      body:
        "Use the interactive checklist and drill above, then layer ResumeDoctor if you want ATS scoring and polished export before portals and Vacancy Chennai uploads.",
      linkLabel: "Structure your résumé on ResumeDoctor",
      disclosure: true,
    },
  },
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
