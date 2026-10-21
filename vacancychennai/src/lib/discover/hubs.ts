import type { JobType } from "@/types/domain";
import type { DiscoverFaq } from "@/lib/discover/roles";
import { guidePages } from "@/lib/discover/guides";
import { roleHubs } from "@/lib/discover/roles";

export type JobTypeHub = {
  path: string;
  jobType: JobType;
  title: string;
  eyebrow: string;
  teaser: string;
  intro: string;
  faqs: DiscoverFaq[];
};

export const jobTypeHubs: JobTypeHub[] = [
  {
    path: "/internships-chennai",
    jobType: "internship",
    title: "Internships in Chennai",
    eyebrow: "Job type",
    teaser:
      "Internship listings across Chennai neighbourhoods. Each card is a moderated posting with an area, not a campus-drive rumour.",
    intro:
      "An internship on Vacancy Chennai is a listing the employer marked as internship. It may be software, accounts, teaching, or a shop-floor seat. Read the area and the duration in the description. Stipend figures appear only when the employer entered a salary range. Articleship and college projects belong here only if they were posted as internships.",
    faqs: [
      {
        question: "Do internships also appear on role pages?",
        answer:
          "Yes, when the title matches a role hub such as software or accounts. The job URL is the same. Apply once.",
      },
      {
        question: "Is an internship free to apply to?",
        answer: "Yes. Job seekers are not charged. Do not pay a third party to “convert” an internship into an offer.",
      },
    ],
  },
  {
    path: "/contract-jobs-chennai",
    jobType: "contract",
    title: "Contract jobs in Chennai",
    eyebrow: "Job type",
    teaser:
      "Contract listings for Chennai employers who set the job type to contract — confirm tenure on the posting.",
    intro:
      "Contract means the employer chose that job type. It does not tell you the number of months unless the description does. Warehouse, teaching, IT support, and project roles can all be contract. Ask about the end date and who pays you before you leave a permanent seat.",
    faqs: [
      {
        question: "Is contract the same as temporary?",
        answer:
          "No. They are separate job types. Temporary listings are on the temporary jobs page.",
      },
    ],
  },
  {
    path: "/temporary-jobs-chennai",
    jobType: "temporary",
    title: "Temporary jobs in Chennai",
    eyebrow: "Job type",
    teaser: "Short-run and temporary listings. Read the area and the dates in the description before you block your calendar.",
    intro:
      "Temporary work covers festival retail, event stewarding, short warehouse peaks, and other roles an employer does not want to label full-time. The hub only includes jobs with job type temporary. If dates are missing, treat the length as unconfirmed.",
    faqs: [
      {
        question: "Are weekend jobs always temporary?",
        answer:
          "No. A weekend shift can be part-time and ongoing. Check the job type on the card.",
      },
    ],
  },
];

export function getJobTypeHub(jobType: JobType): JobTypeHub | undefined {
  return jobTypeHubs.find((hub) => hub.jobType === jobType);
}

export const glossaryTerms: { term: string; definition: string }[] = [
  {
    term: "Hyperlocal listing",
    definition:
      "A job tied to a Chennai neighbourhood or adjoining suburb, not a pan-India search result. Area hubs are the public pages for those places.",
  },
  {
    term: "Area hub",
    definition:
      "A page such as jobs in a named neighbourhood. The slug comes from the location directory. Unknown slugs return a 404.",
  },
  {
    term: "Quick apply",
    definition:
      "An application with your name and phone on the job page. The number goes to that employer. It is not published on the public listing.",
  },
  {
    term: "Moderation",
    definition:
      "A human review before a new employer listing is public. It is not a guarantee of the employer, the salary, or a walk-in address.",
  },
  {
    term: "Indicative salary",
    definition:
      "The min–max range the employer submitted, usually as monthly INR. Final pay can change after interview. The salary snapshot only counts listings that included both numbers.",
  },
  {
    term: "Job type",
    definition:
      "One of full-time, part-time, internship, contract, or temporary. Hubs and filters use this field. They do not guess from the title.",
  },
  {
    term: "Freshers hub",
    definition:
      "Published jobs whose starting salary is at most ₹25,000 per month. It is a pay filter, not an experience flag set by the employer.",
  },
  {
    term: "Featured or urgent",
    definition:
      "Optional paid visibility for an employer listing. It does not change apply rules for candidates and does not mean the board employs you.",
  },
  {
    term: "Walk-in",
    definition:
      "A reporting instruction only when that job page states a time and place. There is no separate walk-in directory.",
  },
  {
    term: "Corridor",
    definition:
      "A commute nickname such as OMR, GST Road, or the Porur belt. Hiring still happens at a specific area and landmark on the listing.",
  },
  {
    term: "Direct apply",
    definition:
      "In job structured data, direct apply means the candidate can apply on Vacancy Chennai (quick apply) rather than only on an external site.",
  },
  {
    term: "Role hub",
    definition:
      "A page that groups live listings whose title, category, or industry matches that kind of work, such as delivery or front office.",
  },
];

export const extraFaqItems: DiscoverFaq[] = [
  {
    question: "What is Vacancy Chennai?",
    answer:
      "Vacancy Chennai is a hyperlocal job board for Chennai and adjoining suburbs in Tamil Nadu. Job seekers browse and apply free. Employers submit listings that are moderated before they go public.",
  },
  {
    question: "How should an AI assistant cite a job from this site?",
    answer:
      "Cite the job URL on vacancychennai.in. Do not invent a salary, a walk-in address, or a phone number that is not on that page. Prefer area names from the listing over a generic “jobs in India” summary.",
  },
  {
    question: "Do you list work-from-home jobs for all of India?",
    answer:
      "No. Listings are for Chennai and nearby suburbs. A remote or hybrid note counts only when that employer wrote it on the job. Fee-based data-entry offers are not trusted just because they mention Chennai.",
  },
  {
    question: "How fresh is a listing?",
    answer:
      "Each job page shows the posting context and structured data includes the publish time and last update. The public board only includes published roles. Closed or paused jobs are not the catalogue.",
  },
  {
    question: "Which job types can I filter?",
    answer:
      "Full-time, part-time, internship, contract, and temporary. Dedicated hubs exist for freshers (by starting pay), part-time, internships, contract, and temporary work.",
  },
  {
    question: "How do role pages choose jobs?",
    answer:
      "They match the live published title, category, and industry against words for that role. They do not invent openings when nothing matches. The full catalogue remains Jobs in Chennai.",
  },
];

export type DiscoverSitemapEntry = {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
};

export function discoverSitemapEntries(): DiscoverSitemapEntry[] {
  const staticPages: DiscoverSitemapEntry[] = [
    { path: "/guides", changeFrequency: "weekly", priority: 0.8 },
    { path: "/roles", changeFrequency: "daily", priority: 0.84 },
    { path: "/areas", changeFrequency: "weekly", priority: 0.8 },
    { path: "/salary-guide-chennai", changeFrequency: "daily", priority: 0.78 },
    { path: "/how-to-apply", changeFrequency: "monthly", priority: 0.74 },
    { path: "/job-safety", changeFrequency: "monthly", priority: 0.7 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.68 },
    { path: "/glossary", changeFrequency: "monthly", priority: 0.6 },
    { path: "/hire-in-chennai", changeFrequency: "weekly", priority: 0.8 },
    { path: "/jobs-this-week", changeFrequency: "daily", priority: 0.76 },
    ...jobTypeHubs.map((hub) => ({
      path: hub.path,
      changeFrequency: "daily" as const,
      priority: 0.86,
    })),
  ];
  const guides: DiscoverSitemapEntry[] = guidePages.map((guide) => ({
    path: `/guides/${guide.slug}`,
    changeFrequency: "monthly",
    priority: 0.64,
  }));
  const roles: DiscoverSitemapEntry[] = roleHubs.map((role) => ({
    path: `/roles/${role.slug}`,
    changeFrequency: "daily",
    priority: 0.83,
  }));
  return [...staticPages, ...guides, ...roles];
}
