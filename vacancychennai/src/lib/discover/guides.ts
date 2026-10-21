import type { DiscoverFaq } from "@/lib/discover/roles";

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type GuidePage = {
  slug: string;
  title: string;
  teaser: string;
  audience: "Job seekers" | "Employers" | "Everyone";
  readMinutes: number;
  updated: string;
  directAnswer: string;
  sections: GuideSection[];
  faqs: DiscoverFaq[];
  related: { href: string; label: string }[];
};

export const guidePages: GuidePage[] = [
  {
    slug: "how-to-get-a-job-in-chennai",
    title: "How to get a job in Chennai",
    teaser: "A practical sequence for finding moderated local listings, choosing an area, and applying without a fee.",
    audience: "Job seekers",
    readMinutes: 6,
    updated: "2026-10-21",
    directAnswer:
      "Start with the neighbourhood you can commute to, open live listings on Vacancy Chennai, and apply on the job page with your name and phone. Do not pay a third party to confirm a seat. A candidate account is optional and is only for tracking applications.",
    sections: [
      {
        heading: "Pick the commute before the job title",
        paragraphs: [
          "Chennai hiring is corridor-shaped. A good role in Ambattur is a bad plan if you live in Sholinganallur and the shift starts at 8. Use area hubs for OMR, Tambaram, Velachery, Porur, Guindy, Nanganallur, and the other neighbourhoods on the areas index.",
          "After the area is realistic, filter by role or job type. Freshers, part-time, internships, contract, and temporary each have their own hub.",
        ],
      },
      {
        heading: "Read the listing like a local",
        paragraphs: [
          "Check the employer name, the area, the job type, and whether a salary range is shown. Ranges are indicative and written by the employer. The landmark is the reporting hint they chose to publish, not an invitation to show up unannounced.",
        ],
        bullets: [
          "If the apply path is quick apply, that form is the application.",
          "If the listing names an external URL or a direct contact, use only what is printed on that job.",
          "Keep the job URL. You will need it if something looks wrong.",
        ],
      },
      {
        heading: "Apply once, then track",
        paragraphs: [
          "Send one application per job. Creating a candidate login lets you see applications later. Browsing stays free either way. For a line-by-line apply path, use the how-to-apply page.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Vacancy Chennai a recruitment agency?",
        answer:
          "No. It is a moderated listings board for Chennai and adjoining suburbs. The employer hires. The board does not collect a candidate fee.",
      },
      {
        question: "Which page is the full catalogue?",
        answer: "Jobs in Chennai lists published roles with area, category, job type, and salary filters.",
      },
    ],
    related: [
      { href: "/how-to-apply", label: "How to apply" },
      { href: "/areas", label: "Neighbourhood hubs" },
      { href: "/roles", label: "Jobs by role" },
    ],
  },
  {
    slug: "which-chennai-area-for-your-commute",
    title: "Which Chennai area fits your commute",
    teaser: "How to choose an area hub using zone, pincode, and shift time instead of searching the whole city.",
    audience: "Job seekers",
    readMinutes: 5,
    updated: "2026-10-21",
    directAnswer:
      "Open the area hub for the neighbourhood you can reach before the shift, not the neighbourhood with the most famous companies. Each hub is a real location in the Vacancy Chennai directory. Unknown area slugs are not public pages.",
    sections: [
      {
        heading: "Match the shift to the road",
        paragraphs: [
          "OMR favours people who already live on the IT corridor or can reach it before park traffic. GST Road and Tambaram favour south and south-west commutes. Guindy is a changeover point for many bus and rail rides. Ambattur and Padi-side industrial roles punish a long south-to-north morning ride.",
          "If two areas are equally possible, compare live listings, not reputation. An empty hub today can still be the right place to check next week.",
        ],
      },
      {
        heading: "Use zone and pincode as published",
        paragraphs: [
          "Every area page is tied to a zone and a pincode from the location directory. That is the geography to cite. Do not invent a nearby landmark and treat it as the reporting address.",
        ],
      },
    ],
    faqs: [
      {
        question: "What if my area is missing?",
        answer:
          "Use the closest hub on the areas index and the full Chennai board. Employers can only attach a job to locations the directory already has.",
      },
    ],
    related: [
      { href: "/areas", label: "All area hubs" },
      { href: "/jobs-in-chennai", label: "Jobs in Chennai" },
      { href: "/guides/omr-gst-road-and-porur", label: "OMR, GST Road, and Porur" },
    ],
  },
  {
    slug: "omr-gst-road-and-porur",
    title: "OMR, GST Road, and Porur hiring",
    teaser: "What kind of Chennai listings tend to sit on three different commute corridors.",
    audience: "Everyone",
    readMinutes: 5,
    updated: "2026-10-21",
    directAnswer:
      "OMR listings skew to offices and support teams along the IT corridor. GST Road and Tambaram listings often mix retail, education, and local services. Porur sits between west Chennai residential areas and the Mount–Poonamallee belt. Always open the live hub. Corridor stereotypes are not a substitute for the current jobs.",
    sections: [
      {
        heading: "OMR",
        paragraphs: [
          "Use OMR-area hubs when the employer’s office is on that corridor. Software, IT support, and shared-service roles appear here, and so do cafeteria, admin, and facility jobs that exist because the offices exist. Night-shift voice roles still need a safe return plan.",
        ],
      },
      {
        heading: "GST Road and Tambaram",
        paragraphs: [
          "South Chennai and the GST Road belt are practical for people who will not cross the city twice a day. Colleges, stores, clinics, and local offices hire here. Check the specific area page. “GST Road” is a corridor, not one pincode.",
        ],
      },
      {
        heading: "Porur and the west",
        paragraphs: [
          "Porur connects residential west Chennai with roads toward Poonamallee. It suits people who want a shorter loop than an OMR commute. Warehouse and delivery hubs may still sit further out. Read the landmark on the job.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I apply on the corridor page or the role page?",
        answer:
          "Both can show the same job. Apply once, from the job detail page. Corridor pages and role pages are two ways to find that URL.",
      },
    ],
    related: [
      { href: "/areas", label: "All neighbourhoods" },
      { href: "/roles/software", label: "Software roles" },
      { href: "/roles/delivery", label: "Delivery roles" },
    ],
  },
  {
    slug: "fresher-first-job-chennai",
    title: "First job in Chennai for freshers",
    teaser: "How to use the freshers hub without treating a salary filter as an experience label.",
    audience: "Job seekers",
    readMinutes: 5,
    updated: "2026-10-21",
    directAnswer:
      "The freshers hub lists published roles whose starting salary is at most ₹25,000 per month. That is a pay filter, not a promise that the employer marked the job “fresher”. Read the description for experience, language, and shift before you apply.",
    sections: [
      {
        heading: "What the hub does",
        paragraphs: [
          "It is a shortlist for entry-level pay bands on the live catalogue. Internships have a separate page because they are a job type. Part-time work has a separate page because the hours differ.",
        ],
      },
      {
        heading: "What to put in a first application",
        paragraphs: [
          "A short note beats a padded résumé. Name your area, the languages you speak, a tool you have used in college or a shop, and the shift you can attend. You can quick-apply with name and phone. A profile is optional.",
        ],
        bullets: [
          "One application per job.",
          "No fee to “forward” your résumé.",
          "Keep the job URL.",
        ],
      },
    ],
    faqs: [
      {
        question: "I have a gap year. Am I still a fresher?",
        answer:
          "Employers decide that from the description they wrote. Use the listing’s requirements, not the hub label.",
      },
    ],
    related: [
      { href: "/freshers-jobs-chennai", label: "Freshers hub" },
      { href: "/internships-chennai", label: "Internships" },
      { href: "/job-seeker-profile", label: "Job seeker profile" },
    ],
  },
  {
    slug: "part-time-shifts-in-chennai",
    title: "Part-time shifts in Chennai",
    teaser: "How part-time, temporary, and contract listings differ when you need hours that fit college or a second shift.",
    audience: "Job seekers",
    readMinutes: 5,
    updated: "2026-10-21",
    directAnswer:
      "Part-time means the employer set the job type to part-time. Temporary and contract are different job types with their own hubs. A role can be retail, delivery, or front office and still be part-time. Check both the role page and the job type.",
    sections: [
      {
        heading: "Three labels that are not synonyms",
        paragraphs: [
          "Part-time is about hours. Temporary is a short run. Contract is a non-permanent engagement the employer chose to label that way. Internship is a fourth type. Filters on the main board use these exact values.",
        ],
      },
      {
        heading: "Questions worth asking",
        paragraphs: [
          "Confirm weekly off, last bus or train you can catch, and whether pay on the listing is monthly or pro-rata. The published range is indicative. Evening retail and morning tuition cannot be assumed to stack.",
        ],
      },
    ],
    faqs: [
      {
        question: "Where do I see only part-time jobs?",
        answer: "Use the part-time jobs in Chennai page. It is the job-type hub, not a keyword search.",
      },
    ],
    related: [
      { href: "/part-time-jobs-chennai", label: "Part-time jobs" },
      { href: "/temporary-jobs-chennai", label: "Temporary jobs" },
      { href: "/contract-jobs-chennai", label: "Contract jobs" },
    ],
  },
  {
    slug: "walk-in-jobs-chennai",
    title: "Walk-in jobs in Chennai: what to check first",
    teaser: "How to treat a walk-in instruction on a listing, and why there is no separate unofficial walk-in list.",
    audience: "Job seekers",
    readMinutes: 5,
    updated: "2026-10-21",
    directAnswer:
      "Go to a walk-in only when that job page tells you to, with a time and a place the employer published. Vacancy Chennai does not keep a second list of walk-in venues. If the page says quick apply, apply on the page. Do not pay for a token, a form, or a “slot”.",
    sections: [
      {
        heading: "Read the apply mode",
        paragraphs: [
          "Each listing uses the contact path the employer submitted: quick apply, an external URL, direct contact, or WhatsApp where that option exists. A walk-in is an instruction inside the description or landmark, not a default.",
        ],
      },
      {
        heading: "Before you travel",
        paragraphs: [
          "Match the day, the reporting time, and the area. Carry copies of documents if the listing asks, and leave originals at home unless the employer is one you already trust. If a person outside the listing demands cash, stop and send the job URL to support@vacancychennai.in.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can you tell me today’s walk-in address for a company?",
        answer:
          "Only the job page can. If it is not written there, it is not a Vacancy Chennai walk-in. Do not rely on a forwarded poster that has no listing URL.",
      },
    ],
    related: [
      { href: "/job-safety", label: "Job safety" },
      { href: "/how-to-apply", label: "How to apply" },
      { href: "/jobs-in-chennai", label: "Live listings" },
    ],
  },
  {
    slug: "spot-a-fake-job-in-chennai",
    title: "How to spot a fake job in Chennai",
    teaser: "Fee demands, vague areas, and pressure to move off the listing are the patterns worth refusing.",
    audience: "Everyone",
    readMinutes: 5,
    updated: "2026-10-21",
    directAnswer:
      "Do not pay anyone for job confirmation, a kit, or a registration form. Apply only through the path on the Vacancy Chennai job URL. Report suspicious posts to support@vacancychennai.in with that URL.",
    sections: [
      {
        heading: "Patterns that should stop you",
        paragraphs: [
          "A fee, a courier charge for an offer letter, or a request to install a remote-access app are outside normal hiring on this board. So is a recruiter who refuses to name the employer printed on the listing.",
        ],
        bullets: [
          "Pay is discussed with the employer after they contact you.",
          "Your phone is shared with employers for jobs you apply to. It is not printed on the public job page.",
          "Moderation reduces junk. It does not make every employer a company you must join.",
        ],
      },
      {
        heading: "What to send in a report",
        paragraphs: [
          "The job URL, what the other person asked you to pay or click, and the time it happened. Do not forward extra copies of your identity documents while you wait.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does moderation mean the job is guaranteed?",
        answer:
          "No. Moderation means the listing was reviewed before publish. You still judge the employer, the area, and the terms.",
      },
    ],
    related: [
      { href: "/job-safety", label: "Safety rules" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    slug: "how-to-write-a-chennai-job-post",
    title: "How to write a Chennai job post that gets local applicants",
    teaser: "Area, shift, salary range, and a plain task list — the fields that make a moderated listing usable.",
    audience: "Employers",
    readMinutes: 6,
    updated: "2026-10-21",
    directAnswer:
      "Name the neighbourhood, the job type, the shift, and an honest monthly range. Describe the work in a few concrete lines. Listings go through moderation before they are public. Featured placement is optional and does not change the facts you must include.",
    sections: [
      {
        heading: "Facts applicants use to self-select",
        paragraphs: [
          "People on this board filter by area and job type first. A Chennai-wide post with no landmark attracts clicks and wastes interviews. Pick the directory location where the person will report.",
        ],
        bullets: [
          "Job type: full-time, part-time, internship, contract, or temporary.",
          "Salary min and max when you know the band. Leave it blank only if you truly discuss pay later.",
          "Language and shift in the description, not in a separate WhatsApp script.",
        ],
      },
      {
        heading: "After you submit",
        paragraphs: [
          "New listings are reviewed on business days before they go live. You manage applicants from the employer dashboard after publish. Pricing covers publish credits and optional featured or urgent treatment. It is not a charge to candidates.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I post a pan-India remote role?",
        answer:
          "The product is hyperlocal. Post a role that has a real Chennai or suburban reporting context. A national remote blast is a poor fit for these area pages.",
      },
    ],
    related: [
      { href: "/hire-in-chennai", label: "Hire in Chennai" },
      { href: "/post-job", label: "Post a job" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    slug: "chennai-interview-questions",
    title: "Questions to ask in a Chennai job interview",
    teaser: "A short list candidates can use so commute, shift, and pay are settled before joining day.",
    audience: "Job seekers",
    readMinutes: 4,
    updated: "2026-10-21",
    directAnswer:
      "Ask where you report, which days you work, whether the published range is fixed pay, and who your manager is. Those four answers prevent most bad joins on local roles. The listing range is indicative until the employer confirms it.",
    sections: [
      {
        heading: "Ask these before you resign",
        paragraphs: [
          "Local jobs fail on logistics more often than on job titles. Confirm the branch, the last shift time, weekly off, and whether field roles need your own vehicle.",
        ],
        bullets: [
          "Which area is the reporting point?",
          "Is the range on the listing fixed, gross, or including incentive?",
          "Who do I meet on day one, and is there any deduction for uniform or ID?",
        ],
      },
      {
        heading: "What you do not need to ask the job board",
        paragraphs: [
          "Vacancy Chennai cannot negotiate your offer. Questions about batta, probation, or notice period belong to the employer named on the job.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I ask for the salary in writing?",
        answer:
          "Yes, from the employer, before you join. The board shows the range they submitted. It is not an appointment letter.",
      },
    ],
    related: [
      { href: "/salary-guide-chennai", label: "Salary snapshot" },
      { href: "/job-safety", label: "Job safety" },
      { href: "/how-to-apply", label: "How to apply" },
    ],
  },
  {
    slug: "phone-only-applications",
    title: "Apply with your phone on Vacancy Chennai",
    teaser: "What quick apply does with your name and number, and what it does not publish.",
    audience: "Job seekers",
    readMinutes: 4,
    updated: "2026-10-21",
    directAnswer:
      "On many listings you can apply with your name and phone and no account. That number is shared with the employer for that job so they can reach you. It is not shown on the public job page. An account is only needed if you want a dashboard of applications.",
    sections: [
      {
        heading: "What you type",
        paragraphs: [
          "Use a phone you answer. Employers in Chennai still call and WhatsApp. A wrong digit looks like a dropped application. Add an email if the form asks and you want a written trail.",
        ],
      },
      {
        heading: "What stays off the public page",
        paragraphs: [
          "Applicant phone numbers are not part of the public listing. Do not also paste your number into unrelated groups. If you want the employer to see skills or a résumé, add them on the job seeker profile after you sign in.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I apply without creating a password?",
        answer:
          "Yes on quick-apply listings. Candidate login is a magic link when the site is running on the database. You can skip it until you want tracking.",
      },
    ],
    related: [
      { href: "/how-to-apply", label: "Apply steps" },
      { href: "/candidate/login", label: "Candidate login" },
      { href: "/job-seeker-profile", label: "Profile" },
    ],
  },
];

export function getGuidePage(slug: string): GuidePage | undefined {
  return guidePages.find((guide) => guide.slug === slug);
}

/** Short ideas on the guides index — each points at a real page. */
export const hiringIdeas: { title: string; body: string; href: string; label: string }[] = [
  {
    title: "Choose the area before the brand",
    body: "Open the neighbourhood hub you can reach, then the role. Fame of the corridor does not shorten the ride.",
    href: "/areas",
    label: "Browse areas",
  },
  {
    title: "Use the pay filter honestly",
    body: "The freshers hub is “starting pay up to ₹25,000”, not a fresher badge the employer clicked.",
    href: "/freshers-jobs-chennai",
    label: "Freshers hub",
  },
  {
    title: "Separate hours from contract type",
    body: "Part-time, temporary, contract, and internship are different filters. Check the one that matches your week.",
    href: "/part-time-jobs-chennai",
    label: "Part-time jobs",
  },
  {
    title: "Read salary as this board’s listings",
    body: "The snapshot uses min–max figures employers entered. It is not a city wage survey.",
    href: "/salary-guide-chennai",
    label: "Salary snapshot",
  },
  {
    title: "Apply on the job URL",
    body: "Quick apply needs your name and phone. Do not pay a forwarder. Keep the link.",
    href: "/how-to-apply",
    label: "How to apply",
  },
  {
    title: "Treat walk-ins as written instructions",
    body: "Travel only if that listing gives a time and place. There is no secret walk-in sheet.",
    href: "/guides/walk-in-jobs-chennai",
    label: "Walk-in guide",
  },
  {
    title: "Employers: write the branch",
    body: "Area, shift, job type, and a real range outperform a louder title.",
    href: "/guides/how-to-write-a-chennai-job-post",
    label: "Writing a post",
  },
  {
    title: "Report the URL, not a rumour",
    body: "If someone asks for a fee, send support the job link and stop sending documents.",
    href: "/job-safety",
    label: "Safety rules",
  },
];
