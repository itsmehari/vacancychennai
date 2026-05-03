import type { Job } from "@/types/domain";

const ONET_SUMMARY = "https://www.onetonline.org/link/summary";

type Rule = { soc: string; test: (haystack: string, job: Job) => boolean };

/** Ordered most-specific first — first match wins. */
const RULES: Rule[] = [
  {
    soc: "15-1252.00",
    test: (h, job) =>
      /\b(software|developer|programmer|full[\s-]?stack|backend|front[\s-]?end|devops|sde)\b/i.test(
        job.title,
      ) || /\bsoftware\b|\bdeveloper\b/i.test(h),
  },
  {
    soc: "15-1232.00",
    test: (h) =>
      /\bit support\b|\bhelp\s*desk\b|\bdesktop\s*support\b|\btechnical\s*support\b|\bsystem\s*admin/i.test(
        h,
      ),
  },
  {
    soc: "15-1212.00",
    test: (h) => /\b(information security|cyber security|soc analyst|infosec)\b/i.test(h),
  },
  {
    soc: "15-2051.00",
    test: (h) => /\bdata scientist\b|\bmachine learning\b|\bdata analyst\b|\bml engineer\b/i.test(h),
  },
  {
    soc: "11-2021.00",
    test: (h) => /\bmarketing manager\b|\bbrand manager\b|\bgrowth lead\b/i.test(h),
  },
  {
    soc: "13-1161.00",
    test: (h) =>
      /\bmarketing\b|\bdigital marketing\b|\bseo\b|\bcontent marketer\b|\bsocial media\b/i.test(h),
  },
  {
    soc: "41-4012.00",
    test: (h) => /\bsales executive\b|\bsales representative\b|\bbusiness development\b|\bbdm\b|\bbde\b/i.test(h),
  },
  {
    soc: "41-2031.00",
    test: (h) => /\bretail\b|\bcounter sales\b|\bstore associate\b|\bcashier\b/i.test(h),
  },
  {
    soc: "43-4051.00",
    test: (h) => /\bbpo\b|\btelecaller\b|\bcall center\b|\bcustomer care\b|\bcustomer service\b/i.test(h),
  },
  {
    soc: "43-6014.00",
    test: (h) =>
      /\badmin\b|\badministrative assistant\b|\boffice assistant\b|\bsecretary\b|\breceptionist\b/i.test(h),
  },
  {
    soc: "11-1021.00",
    test: (h, job) =>
      /\boffice manager\b|\boperations manager\b|\bbranch manager\b|\bstore manager\b/i.test(
        `${job.title} ${h}`,
      ),
  },
  {
    soc: "13-1071.00",
    test: (h) => /\bhr\b|\bhuman resources\b|\brecruiter\b|\btalent acquisition\b/i.test(h),
  },
  {
    soc: "43-3031.00",
    test: (h) => /\baccountant\b|\baccounts\b|\btally\b|\bbookkeeping\b|\bfinance executive\b/i.test(h),
  },
  {
    soc: "53-3032.00",
    test: (h) => /\bdelivery\b|\bdriver\b|\blast[\s-]?mile\b|\bfleet\b/i.test(h),
  },
  {
    soc: "53-7062.00",
    test: (h) => /\blogistics\b|\bwarehouse\b|\blabourer\b|\blaborer\b|\bpackaging\b/i.test(h),
  },
  {
    soc: "27-4021.00",
    test: (h) =>
      /\bphotographer\b|\bvideographer\b|\bcinematographer\b|\bvideo editor\b|\bcontent creator\b/i.test(h),
  },
  {
    soc: "27-1024.00",
    test: (h) => /\bgraphic designer\b|\bui\b|\bux\b|\bdesigner\b/i.test(h),
  },
  {
    soc: "23-2099.00",
    test: (h) => /\blegal\b|\badvocate\b|\bparalegal\b|\blaw firm\b/i.test(h),
  },
  {
    soc: "17-3027.00",
    test: (h) =>
      /\bmanufacturing\b|\bproduction engineer\b|\bquality inspector\b|\bmachine operator\b|\bplant engineer\b/i.test(
        h,
      ) && !/\bsoftware\b|\bdeveloper\b|\bit support\b|\bdata\b/i.test(h),
  },
  {
    soc: "29-1141.00",
    test: (h) => /\bnurse\b|\brn\b|\bstaff nurse\b/i.test(h),
  },
  {
    soc: "31-1122.00",
    test: (h) => /\bphysiotherapy\b|\bhome care\b|\bhealthcare assistant\b/i.test(h),
  },
];

/**
 * O*NET-SOC summary URL for schema.org `occupationalCategory` when we can infer safely.
 * See: https://www.onetcenter.org/taxonomy.html
 */
export function resolveOnetOccupationalCategoryUrl(job: Job): string | undefined {
  const haystack = `${job.title} ${job.category} ${job.industry}`.toLowerCase();
  for (const rule of RULES) {
    if (rule.test(haystack, job)) return `${ONET_SUMMARY}/${rule.soc}`;
  }
  return undefined;
}
