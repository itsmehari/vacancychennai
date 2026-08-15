/**
 * Home page copy and FAQ — shared with FAQPage JSON-LD (must match exactly on-page).
 */
export type HomeFaqItem = {
  question: string;
  answer: string;
};

export const homeFaqItems: HomeFaqItem[] = [
  {
    question: "How do I apply for a job on Vacancy Chennai?",
    answer:
      "Open any job, enter your name and phone on the quick apply form, and submit. You can browse all Chennai listings or filter by area and category first.",
  },
  {
    question: "Do I need an account to apply?",
    answer:
      "You can apply to many roles with just your name and phone. Creating a candidate account lets you track applications from your dashboard.",
  },
  {
    question: "Is my phone number visible to everyone?",
    answer:
      "Your contact details are shared with employers for jobs you apply to so they can reach you. We do not publish your phone on public job pages.",
  },
  {
    question: "Are salary ranges final?",
    answer:
      "Salary ranges are indicative and shared by employers. Final pay may vary after interview and discussion.",
  },
  {
    question: "How does posting a job work for employers?",
    answer:
      "Sign in as an employer, submit your role with location and details, and listings go through quick moderation before going live. See Pricing for featured options.",
  },
  {
    question: "How long does moderation take?",
    answer:
      "We aim to review new listings quickly on business days. Urgent packs may be prioritised where available.",
  },
  {
    question: "Is Vacancy Chennai free for job seekers?",
    answer:
      "Yes. Browsing Chennai listings and applying is free. You can quick-apply with name and phone, or create a candidate account to track applications.",
  },
  {
    question: "Which Chennai areas can I search?",
    answer:
      "Listings are organised by micro-area and corridor — including OMR, Velachery, Tambaram, Porur, Ambattur, Guindy, Nanganallur, and other Greater Chennai neighbourhoods on the area hubs.",
  },
  {
    question: "How do I find part-time or fresher jobs in Chennai?",
    answer:
      "Use the Part-time jobs Chennai hub or the Freshers jobs Chennai hub, or filter the main Jobs in Chennai board by job type and category.",
  },
  {
    question: "How do I report a suspicious or fake job?",
    answer:
      "Do not pay anyone for job confirmation. Use the Contact page (support@vacancychennai.in) and include the job URL so we can review the listing.",
  },
];
