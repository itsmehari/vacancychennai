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
];
