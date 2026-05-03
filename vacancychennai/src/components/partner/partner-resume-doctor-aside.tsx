import { resumeDoctorReferralUrl } from "@/lib/partner-resumedoctor";

type Props = {
  /** Plan `utm_content` token, e.g. `hub_freshers`, `profile_checklist`. */
  utmContent: string;
  /** Optional headline; default Résumé & ATS */
  headline?: string;
  body?: string;
  linkLabel?: string;
  /** Disclosure line for EEAT transparency */
  disclosure?: boolean;
};

/**
 * Editorial aside linking to ResumeDoctor — no sitewide duplicate copy;
 * compose unique body per placement.
 */
export function PartnerResumeDoctorAside({
  utmContent,
  headline = "Résumé & ATS",
  body = "Sharpen formatting and keywords before you upload here or apply on portals.",
  linkLabel = "ResumeDoctor — build an ATS-ready resume",
  disclosure = true,
}: Props) {
  const href = resumeDoctorReferralUrl(utmContent);

  return (
    <aside
      className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/40 px-4 py-5 text-sm text-slate-800 shadow-sm"
      aria-label="Partner tool for resumes"
      data-component="resume-doctor-aside"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-900">{headline}</p>
      <p className="mt-2 leading-relaxed">{body}</p>
      <p className="mt-3">
        <a
          href={href}
          className="font-semibold text-blue-700 underline-offset-4 hover:text-blue-900 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
          data-utm-content={utmContent}
          data-partner-link="resume-doctor"
        >
          {linkLabel}
        </a>
      </p>
      {disclosure ? (
        <p className="mt-3 border-t border-slate-200/80 pt-3 text-xs text-slate-500">
          Sister product from our team — we only earn your trust when the link solves the next step in your hunt.
        </p>
      ) : null}
    </aside>
  );
}
