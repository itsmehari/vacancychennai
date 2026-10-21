export type DiscoverFaq = { question: string; answer: string };

export type RoleHub = {
  slug: string;
  label: string;
  title: string;
  teaser: string;
  /** Matched against title, category, and industry. Short tokens use word boundaries. */
  keywords: string[];
  /** Optional Jobs-in-Chennai category query. */
  categoryQuery?: string;
  intro: string;
  where: string;
  applyTips: string[];
  faqs: DiscoverFaq[];
};

export const roleHubs: RoleHub[] = [
  {
    slug: "telecaller",
    label: "Telecaller & BPO",
    title: "Telecaller and BPO jobs in Chennai",
    teaser:
      "Voice, telesales, and customer-care roles on Chennai listings — what the shift usually involves and how to apply without paying a fee.",
    keywords: [
      "telecaller",
      "tele caller",
      "telesales",
      "bpo",
      "customer care",
      "voice process",
      "call center",
      "call centre",
      "customer support",
    ],
    categoryQuery: "BPO",
    intro:
      "Chennai telecaller and voice-process hiring clusters around IT parks, back-office floors, and neighbourhood customer-care teams. A useful listing names the shift (day, evening, or night), the language mix (Tamil, English, or both), and whether the work is inbound support or outbound sales. Those three facts change the commute and the pay conversation more than a generic “BPO jobs” headline.",
    where:
      "Voice floors show up along OMR, Guindy, and Ambattur, and also in suburban offices near Tambaram and Porur when the employer wants staff who live nearby. Start from the area hub that matches your commute, then open this role page to see live matches.",
    applyTips: [
      "Say which languages you can handle on calls, not only “good communication”.",
      "Mention if you can work a night or weekend shift. Many mismatches happen there.",
      "Use quick apply with your own phone. Do not pay a third party to “confirm” a voice-process seat.",
    ],
    faqs: [
      {
        question: "Do Chennai telecaller jobs require a degree?",
        answer:
          "Many voice and telesales listings ask for 12th or any degree, plus clear Tamil or English. Read the individual listing. Vacancy Chennai does not add education rules that the employer did not write.",
      },
      {
        question: "Is a telecaller job the same as a BPO job?",
        answer:
          "Not always. BPO can mean voice, chat, email, or back office. This hub surfaces listings whose title, category, or industry matches telecalling, customer care, or BPO wording.",
      },
    ],
  },
  {
    slug: "data-entry",
    label: "Data entry",
    title: "Data entry jobs in Chennai",
    teaser:
      "Back-office and data-entry openings for people who want a desk role near home, with a clear way to apply on the listing.",
    keywords: ["data entry", "data-entry", "back office", "back-office", "computer operator", "mis executive"],
    categoryQuery: "Admin",
    intro:
      "Data-entry hiring in Chennai is usually a desk role: forms, invoices, spreadsheets, or MIS updates for a shop, clinic, logistics desk, or office. Speed matters less than accuracy and a shift you can actually attend. Listings that hide the area or the tool (Excel, Tally, a company portal) create wasted interviews.",
    where:
      "These roles follow offices, not a single corridor. Check Guindy, Nanganallur, Tambaram, Velachery, and Porur hubs if you want a short commute, and OMR if you are aiming at larger back offices.",
    applyTips: [
      "Name the tools you have used: Excel, Google Sheets, Tally, or a billing app.",
      "Give a realistic typing or accuracy note only if you can stand by it in a test.",
      "Apply on the listing page. A data-entry “registration fee” is a warning sign.",
    ],
    faqs: [
      {
        question: "Are work-from-home data-entry jobs listed here?",
        answer:
          "Only if the employer published that listing and moderation approved it. Vacancy Chennai is a Chennai board. Treat generic work-from-home data-entry offers that ask for a fee as unsafe, even if they mention the city.",
      },
      {
        question: "What should I filter before I apply?",
        answer:
          "Area, shift, and whether a salary range is shown. Then read the description for the actual task. The same “data entry” title can mean billing, catalogue cleanup, or document scanning.",
      },
    ],
  },
  {
    slug: "accountant",
    label: "Accounts",
    title: "Accountant and accounts jobs in Chennai",
    teaser:
      "Accounts, Tally, and bookkeeping roles on moderated Chennai listings — how to read the range and what to put in an application.",
    keywords: ["accountant", "accounts executive", "accounts", "tally", "bookkeep", "gst executive"],
    intro:
      "Accounts hiring in Chennai splits into junior bill-entry seats and roles that own GST, reconciliation, or a full books set. The listing should say which one it is. A salary range is indicative and comes from the employer; final pay is set in the interview.",
    where:
      "Trading streets, retail back offices, and industrial pockets (Ambattur, Guindy, Padi side) hire accounts staff as often as IT corridors do. Pick the neighbourhood hub closest to the books you want to handle.",
    applyTips: [
      "List Tally, GST returns, or Excel only for work you have done.",
      "Mention full-time versus part-time. Many small firms want someone on site through closing hours.",
      "Keep certificates ready, but do not upload them to a stranger outside the listing.",
    ],
    faqs: [
      {
        question: "Do you publish a standard Chennai accountant salary?",
        answer:
          "No. The salary snapshot page shows ranges that employers actually typed on live listings. It is not a city-wide pay survey. Open each accounts job for the range on that role.",
      },
      {
        question: "Is articleship the same as an accounts job here?",
        answer:
          "Only if the employer posted it as an internship or a job. Use the internships hub for intern and articles-style listings, and this page for accounts titles.",
      },
    ],
  },
  {
    slug: "sales",
    label: "Sales",
    title: "Sales executive jobs in Chennai",
    teaser:
      "Field sales, counter sales, and business-development roles across Chennai neighbourhoods — commute and incentive notes to check first.",
    keywords: ["sales executive", "sales officer", "business development", "field sales", "marketing executive", "counter sales"],
    intro:
      "Sales jobs in Chennai vary more by territory than by title. A Velachery counter role and an OMR field role can share the words “sales executive” and still demand a different bike, a different language, and a different incentive plan. Read the area and the description before you apply.",
    where:
      "Retail sales sits inside malls and high streets. Field sales follows the territory named on the listing — often a corridor such as GST Road, OMR, or a set of neighbourhoods. If the territory is missing, ask in the interview before you accept a target.",
    applyTips: [
      "Say whether you have a two-wheeler and a licence if the role is in the field.",
      "Separate fixed pay from incentive in your own notes. The listing range may be fixed, incentive, or a mix.",
      "Apply once per listing. Repeat calls to the board do not speed moderation.",
    ],
    faqs: [
      {
        question: "Are commission-only sales jobs included?",
        answer:
          "If an employer publishes one, it can appear when the title matches. Prefer listings that show a salary range. Commission-only offers with an upfront kit fee need extra caution.",
      },
      {
        question: "Which page lists every sales opening?",
        answer:
          "This page lists current moderated jobs whose title, category, or industry matches sales wording. The full board at Jobs in Chennai is still the complete catalogue.",
      },
    ],
  },
  {
    slug: "delivery",
    label: "Delivery",
    title: "Delivery and logistics jobs in Chennai",
    teaser:
      "Rider, courier, and warehouse-desk logistics roles — what to confirm about vehicle, shift, and area before you apply.",
    keywords: ["delivery", "rider", "courier", "last mile", "logistics executive", "logistics"],
    categoryQuery: "Logistics",
    intro:
      "Delivery hiring in Chennai is hyperlocal by nature: the dark store, the hub, or the client warehouse is the job. A listing should name the area and whether you need your own vehicle. Night sorting and daytime drops are different jobs even when the pay band looks similar.",
    where:
      "Hubs sit near residential demand (Velachery, Tambaram, Porur, OMR) and near industrial dispatch (Ambattur, Guindy, Sriperumbudur side when an employer posts that far). Use the area page for the hub you can reach before peak hour.",
    applyTips: [
      "State vehicle type: bicycle, scooter, or none (if it is a hub desk role).",
      "Mention a driving licence only when you have it.",
      "Ignore anyone who asks you to pay for a bag, an ID, or “onboarding” outside the employer named on the listing.",
    ],
    faqs: [
      {
        question: "Is a delivery job part-time?",
        answer:
          "Sometimes. Filter part-time jobs in Chennai for shift-friendly listings, and use this page for delivery and logistics titles of any job type.",
      },
      {
        question: "Do you guarantee orders or a daily wage?",
        answer:
          "No. Pay and order volume are whatever the employer wrote and later confirms. Vacancy Chennai moderates the listing; it does not employ riders.",
      },
    ],
  },
  {
    slug: "driver",
    label: "Driver",
    title: "Driver jobs in Chennai",
    teaser:
      "Car, cab, and goods-vehicle driver listings for Chennai — licence class and duty hours to check on the posting.",
    keywords: ["driver", "driving", "light vehicle", "heavy vehicle", "hmv", "lmv", "cab driver"],
    intro:
      "Driver listings need a licence class and a duty pattern. A school-cab run, a night intercity drop, and a showroom driver are not interchangeable. The landmark or area on the listing is the reporting point, not a guess you should fill in yourself.",
    where:
      "Reporting points follow the employer: residential areas for staff cabs, Guindy and Ambattur for goods movement, and hotel or corporate pockets for chauffeur work. Open the area hub named on the job before you travel.",
    applyTips: [
      "Write licence type and years of Chennai city driving, not only “experienced driver”.",
      "Say if you can read Tamil and English place names.",
      "Do not hand over original documents to a broker. Apply through the listing.",
    ],
    faqs: [
      {
        question: "Are walk-in driver interviews listed separately?",
        answer:
          "Only when the employer describes a walk-in on that job. There is no second, unofficial walk-in list. Read the hiring guide on walk-ins before you travel.",
      },
      {
        question: "Does the salary include batta or overtime?",
        answer:
          "Only if the description says so. Treat the published range as indicative. Confirm batta, night allowance, and food in the interview.",
      },
    ],
  },
  {
    slug: "receptionist",
    label: "Front office",
    title: "Receptionist and front office jobs in Chennai",
    teaser:
      "Front desk, reception, and front-office roles for clinics, offices, and showrooms across Chennai.",
    keywords: ["receptionist", "front office", "front desk", "front-office", "guest relation"],
    intro:
      "Front-office work in Chennai is a language and timing job: greeting walk-ins, handling calls, and keeping a desk covered through lunch and closing. Clinics, coaching centres, apartments, and showrooms hire for this as often as large companies do.",
    where:
      "Look near the building you would actually sit in — Nanganallur, Adyar, Velachery, Anna Nagar, T. Nagar, and OMR all show different desk styles. The area hub is a better filter than a city-wide search if the commute is the constraint.",
    applyTips: [
      "Lead with Tamil and English, and any other language the lobby needs.",
      "Mention billing or appointment software only if you have used it.",
      "Ask the listing’s apply path. A front-desk role should not require a payment to “hold the seat”.",
    ],
    faqs: [
      {
        question: "Is front office the same as admin?",
        answer:
          "Often related, not identical. Admin can be back office. This hub matches receptionist, front desk, and front-office wording on the live catalogue.",
      },
      {
        question: "Can freshers apply?",
        answer:
          "Yes when the listing does not demand prior desk experience. The freshers hub is a salary-band view; this page is the role view. Read both if you are on your first job.",
      },
    ],
  },
  {
    slug: "retail",
    label: "Retail",
    title: "Retail jobs in Chennai",
    teaser:
      "Counter, showroom, and shop-floor roles — how to judge store location, closing time, and pay before you apply.",
    keywords: ["retail", "cashier", "showroom", "shop floor", "store executive", "sales associate"],
    categoryQuery: "Retail",
    intro:
      "Retail hiring follows the store, not the brand slogan. Closing time, weekly off, and whether the branch is inside a mall change the job as much as the title. A listing with a neighbourhood and a salary range is easier to trust than a city-wide “urgent retail” post with no branch.",
    where:
      "High streets and malls in T. Nagar, Velachery, Porur, Tambaram, and OMR carry different footfall and different shift ends. Use the area page for the branch you can reach, then come back here for retail-worded listings.",
    applyTips: [
      "Say if you can work weekends and festival weeks.",
      "Counter cash handling is a specific skill. Mention it only if you have done it.",
      "Uniform or security deposits demanded by someone who is not the employer on the listing are a stop sign.",
    ],
    faqs: [
      {
        question: "Do retail jobs include sales targets?",
        answer:
          "Some do. The description should say if pay is fixed, incentive, or both. If it is silent, ask before you join. The published range is indicative.",
      },
      {
        question: "Where are part-time retail shifts?",
        answer:
          "Open part-time jobs in Chennai and also check this page. A store role can be full-time on this hub and still have a weekend variant on the part-time hub.",
      },
    ],
  },
  {
    slug: "it-support",
    label: "IT support",
    title: "IT support jobs in Chennai",
    teaser:
      "Desktop support, helpdesk, and on-site IT roles for Chennai offices — skills to name and areas where the seats usually are.",
    keywords: ["it support", "desktop support", "helpdesk", "help desk", "system administrator", "hardware engineer", "technical support"],
    categoryQuery: "IT Support",
    intro:
      "IT support in Chennai is often on-site: printers, desktops, access cards, and a ticket queue inside one office or a small circuit of offices. It is not the same posting as a software developer role. Name the environment you know (Windows, networking basics, hardware) in plain language.",
    where:
      "Support seats follow the office they serve — OMR and Guindy for larger floors, and suburban companies that want someone who can reach the office without a two-hour ride. The listing area is the first filter.",
    applyTips: [
      "List tickets you have closed or labs you have maintained, not a pile of tool acronyms.",
      "Say if you can travel between two branches in the same zone.",
      "Software product roles live on the software hub. Apply there if the work is coding, not deskside support.",
    ],
    faqs: [
      {
        question: "Is IT support a fresher-friendly role in Chennai?",
        answer:
          "Some listings are. Others want a year of deskside work. Read the description. The freshers hub only groups lower published salary bands; it is not an experience label.",
      },
      {
        question: "Do you list remote IT support?",
        answer:
          "Only when the employer says the role is remote or hybrid on that posting. Assume on-site in the named area unless the text says otherwise.",
      },
    ],
  },
  {
    slug: "software",
    label: "Software",
    title: "Software developer jobs in Chennai",
    teaser:
      "Developer and software roles on the Chennai board — how they differ from IT support, and what a useful listing includes.",
    keywords: ["software", "developer", "programmer", "full stack", "frontend", "front end", "backend", "back end", "web developer"],
    intro:
      "Software listings on a hyperlocal board should still say where you sit. Chennai product and services teams often expect a base office on OMR, Guindy, or a named park even when a hybrid day exists. Read stack, experience, and area together. A title alone is not a match.",
    where:
      "OMR and the Guindy–Alandur belt carry many engineering offices. Suburban listings are worth opening when the employer wants someone local. Use area hubs plus this role page so you do not miss a neighbourhood team.",
    applyTips: [
      "Name one stack you can discuss in an interview this week.",
      "Link a résumé or portfolio only in the apply flow you trust, not in a random chat.",
      "If the post is deskside support, use the IT support hub instead of forcing a developer application.",
    ],
    faqs: [
      {
        question: "Are internships included in software jobs?",
        answer:
          "A software internship appears here if the title matches, and also on the internships hub because of its job type. You can apply from either URL; it is the same listing.",
      },
      {
        question: "Why is this not a pan-India tech portal?",
        answer:
          "Vacancy Chennai is for roles tied to Chennai and adjoining suburbs. Do not treat it as a national remote-job index. Cite the job URL, not a generalised “Chennai tech salary”.",
      },
    ],
  },
  {
    slug: "nurse",
    label: "Nursing",
    title: "Nurse jobs in Chennai",
    teaser:
      "Staff nurse and clinical support listings — what to verify on the posting before you share your registration details.",
    keywords: ["nurse", "nursing", "staff nurse", "gnm", "anm"],
    intro:
      "Nursing listings should name the facility area, the shift, and whether the seat is ward, clinic, or home-care support. Registration and experience belong in the application to that employer, not in a public comment. Vacancy Chennai does not invent hospital names or bed counts.",
    where:
      "Hospitals and clinics are spread across the city. Filter by the area you can reach for a handover shift — a night shift across the city is a different decision from a day clinic near home.",
    applyTips: [
      "State qualification and council registration as facts you can prove.",
      "Mention shift flexibility explicitly.",
      "Do not pay a “placement” fee to a person who is not the employer written on the job.",
    ],
    faqs: [
      {
        question: "Do you verify nursing council registration?",
        answer:
          "Moderation checks the listing. The employer checks your registration. Send documents through the apply path on that job, not to an unrelated number.",
      },
      {
        question: "Are home-care nursing jobs included?",
        answer:
          "Yes if the published title or category matches nursing wording. Read the area carefully. Home care is travel-heavy.",
      },
    ],
  },
  {
    slug: "teacher",
    label: "Teaching",
    title: "Teacher and tutor jobs in Chennai",
    teaser:
      "School, tuition, and trainer listings in Chennai — subject, medium, and branch to confirm before you apply.",
    keywords: ["teacher", "tutor", "faculty", "trainer", "lecturer"],
    intro:
      "Teaching jobs in Chennai need a subject, a medium (Tamil or English), and a branch. A tuition centre in Tambaram and a school on OMR do not become the same job because both say “teacher”. Trainer roles (software, retail, soft skills) also match this hub; read the employer and the description.",
    where:
      "Schools and coaching centres follow residential neighbourhoods. Use the area hub for the branch, then confirm timings. Evening tuition and daytime school hours rarely mix in one seat.",
    applyTips: [
      "Lead with subject and classes or grades you have taught.",
      "Say the medium you can teach in.",
      "Ask whether the range is per month or per hour when the listing is ambiguous. Do not assume.",
    ],
    faqs: [
      {
        question: "Are tuition and school jobs grouped together?",
        answer:
          "They share this hub because of title wording. They are not the same contract. The job type field (full-time, part-time, contract) and the description decide which one you are reading.",
      },
      {
        question: "Can I post a tutor requirement as a job seeker?",
        answer:
          "Job seekers browse and apply here. Employers post jobs. A public “I am looking” note is a different flow, currently the Nanganallur job-need page, not this role hub.",
      },
    ],
  },
  {
    slug: "warehouse",
    label: "Warehouse",
    title: "Warehouse jobs in Chennai",
    teaser:
      "Picker, packer, storekeeper, and inventory roles — shift, standing work, and hub location to read first.",
    keywords: ["warehouse", "storekeeper", "picker", "packer", "inventory", "store keeper"],
    intro:
      "Warehouse work is physical and shift-based. The useful facts are the hub address area, the shift clock, and whether the role is picking, loading, or paperwork. A “warehouse executive” title can still be a desk inventory job. Read the description.",
    where:
      "Industrial and logistics belts — Ambattur, Guindy, Sriperumbudur-side posts, and large suburban hubs near Tambaram or Oragadam when employers list them. Do not travel to a landmark that is not on the listing.",
    applyTips: [
      "Say if you can do a standing shift and lift the loads the description names.",
      "Mention prior scanner, WMS, or store-keeping work plainly.",
      "Safety shoes or ID cards should come from the employer after selection, not from a prepaid kit seller.",
    ],
    faqs: [
      {
        question: "Are warehouse jobs only for men?",
        answer:
          "No. Apply to the listing you can do. If a post states an unlawful restriction, report the URL to support@vacancychennai.in.",
      },
      {
        question: "How do I see only contract warehouse hiring?",
        answer:
          "Open contract jobs in Chennai, or check the job type on each card here. This hub is by role wording, not by contract status.",
      },
    ],
  },
  {
    slug: "hotel",
    label: "Hotel & kitchen",
    title: "Hotel and kitchen jobs in Chennai",
    teaser:
      "Housekeeping, steward, kitchen, and hotel floor roles — shift end times and the property area matter more than the headline.",
    keywords: ["hotel", "housekeeping", "steward", "chef", "kitchen", "f&b", "food and beverage"],
    intro:
      "Hotel and kitchen hiring in Chennai is shift work tied to one property or one cloud kitchen. Housekeeping, stewarding, and the hot kitchen are different skills. The listing should make the department obvious. If it does not, treat the title as incomplete and ask before you resign from a current job.",
    where:
      "Properties sit in commercial and residential pockets across the city, not only on the beach road. Use the area named on the job. A kitchen commute at 6 a.m. is the real constraint.",
    applyTips: [
      "Name the section: housekeeping, service, bakery, or Indian kitchen.",
      "State food-handling or property experience you can discuss.",
      "Never pay a “uniform and medical” bundle to someone who will not name the property on the listing.",
    ],
    faqs: [
      {
        question: "Do you list banquet or weekend-only hotel work?",
        answer:
          "Yes when an employer posts it as part-time, temporary, or contract. Check the job type on the card and the part-time hub.",
      },
      {
        question: "Is chef the same hub as housekeeping?",
        answer:
          "They share this page so kitchen and hotel floor roles are discoverable. Read the title. Apply only to the department you have done or were trained for.",
      },
    ],
  },
];

export function getRoleHub(slug: string): RoleHub | undefined {
  return roleHubs.find((role) => role.slug === slug);
}
