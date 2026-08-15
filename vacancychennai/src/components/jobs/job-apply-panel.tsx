import JobSeekerProfileCta from "@/components/marketing/job-seeker-profile-cta";
import { quickApplyAction } from "@/features/applications/actions";
import { btnPrimary, formInput, sectionCard } from "@/lib/ui";

type DirectContact = {
  email: string;
  phoneE164: string;
  phoneLabel: string;
};

type Prefill = {
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  resumeLink: string;
  profileHeadline: string;
  skillsPreview: string;
} | null;

type Props = {
  jobId: string;
  jobTitle: string;
  whatsappOnly: boolean;
  waDigits?: string;
  externalApplyUrl?: string;
  directContact: DirectContact | null;
  query: { success?: string; error?: string };
  prefill: Prefill;
};

export function JobApplyPanel({
  jobId,
  jobTitle,
  whatsappOnly,
  waDigits,
  externalApplyUrl,
  directContact,
  query,
  prefill,
}: Props) {
  return (
    <section className={sectionCard} aria-labelledby="job-apply-heading">
      {whatsappOnly ? (
        <>
          <h2 id="job-apply-heading" className="text-lg font-semibold text-slate-900">
            How to apply
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            The employer asked for applications on WhatsApp first. Send your résumé in chat; avoid
            phone calls unless they request a call back.
          </p>
          {waDigits ? (
            <a
              href={`https://wa.me/${waDigits}`}
              className={`${btnPrimary} mt-4 inline-flex w-full justify-center`}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="job-whatsapp-apply"
            >
              Open WhatsApp
            </a>
          ) : (
            <p className="mt-4 text-sm text-amber-900">
              WhatsApp apply is not configured for this listing — use the employer contact details in
              the description.
            </p>
          )}
        </>
      ) : externalApplyUrl ? (
        <>
          {query.error === "external-apply-url" ? (
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-100">
              Vacancy Chennai quick apply is off for this listing — use the employer careers link
              below.
            </p>
          ) : null}
          <h2 id="job-apply-heading" className="text-lg font-semibold text-slate-900">
            How to apply
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Continue on the employer site to submit your application.
          </p>
          <a
            href={externalApplyUrl}
            className={`${btnPrimary} mt-4 inline-flex w-full justify-center`}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="job-external-careers-apply"
          >
            Open employer careers page
          </a>
        </>
      ) : directContact ? (
        <>
          {query.error === "direct-employer-contact" ? (
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-100">
              Quick apply is turned off for this listing — use email or phone below.
            </p>
          ) : null}
          <h2 id="job-apply-heading" className="text-lg font-semibold text-slate-900">
            How to apply
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Contact the employer directly. Vacancy Chennai does not collect applications for this
            posting.
          </p>
          <a
            href={`mailto:${directContact.email}?subject=${encodeURIComponent(`Application: ${jobTitle}`)}`}
            className={`${btnPrimary} mt-4 inline-flex w-full justify-center`}
            data-cta="job-direct-email-apply"
          >
            Email {directContact.email}
          </a>
          <a
            href={`tel:${directContact.phoneE164.replace(/\s/g, "")}`}
            className={`${btnPrimary} mt-3 inline-flex w-full justify-center bg-slate-800 ring-slate-800 hover:bg-slate-900`}
            data-cta="job-direct-phone-apply"
          >
            Call {directContact.phoneLabel}
          </a>
          {waDigits ? (
            <a
              href={`https://wa.me/${waDigits}?text=${encodeURIComponent(
                `Hi, I saw the ${jobTitle} opening on Vacancy Chennai and would like to apply.`,
              )}`}
              className={`${btnPrimary} mt-3 inline-flex w-full justify-center bg-slate-800 ring-slate-800 hover:bg-slate-900`}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="job-direct-whatsapp-apply"
            >
              WhatsApp {directContact.phoneLabel}
            </a>
          ) : null}
        </>
      ) : (
        <>
          <h2 id="job-apply-heading" className="text-lg font-semibold text-slate-900">
            Quick apply
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Name + phone is enough. Signed-in candidates can pre-fill from their profile.
          </p>
          {prefill && (prefill.profileHeadline || prefill.skillsPreview) ? (
            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 ring-1 ring-slate-100">
              <p className="font-semibold text-slate-800">From your profile</p>
              {prefill.profileHeadline ? (
                <p className="mt-1">
                  <span className="text-slate-500">Headline: </span>
                  {prefill.profileHeadline}
                </p>
              ) : null}
              {prefill.skillsPreview ? (
                <p className="mt-1">
                  <span className="text-slate-500">Skills: </span>
                  {prefill.skillsPreview}
                </p>
              ) : null}
            </div>
          ) : null}
          {query.success === "applied" && (
            <div className="mt-4 space-y-3">
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
                Application submitted successfully.
              </p>
              <JobSeekerProfileCta variant="inline" dataCta="job-detail-post-apply" />
            </div>
          )}
          {query.error === "whatsapp-only" && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-100">
              This role is WhatsApp-only — use the button above or the number in the description.
            </p>
          )}
          {query.error &&
            query.error !== "whatsapp-only" &&
            query.error !== "direct-employer-contact" &&
            query.error !== "external-apply-url" && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
                Could not submit application. Please check your details.
              </p>
            )}
          <form action={quickApplyAction} className="mt-4 grid gap-3">
            <input type="hidden" name="jobId" value={jobId} />
            <input
              className={formInput}
              name="applicantName"
              placeholder="Your full name"
              required
              defaultValue={prefill?.applicantName}
              autoComplete="name"
            />
            <input
              className={formInput}
              name="applicantPhone"
              placeholder="Phone number"
              required
              defaultValue={prefill?.applicantPhone}
              autoComplete="tel"
            />
            <input
              className={formInput}
              name="applicantEmail"
              type="email"
              placeholder="Email (optional)"
              defaultValue={prefill?.applicantEmail}
              autoComplete="email"
            />
            <input
              className={formInput}
              name="resumeLink"
              placeholder="Resume link (optional)"
              defaultValue={prefill?.resumeLink}
            />
            <button type="submit" className={btnPrimary}>
              Apply now
            </button>
          </form>
          <div className="mt-6 border-t border-slate-100 pt-4">
            <JobSeekerProfileCta variant="inline" dataCta="job-detail-profile-hint" />
          </div>
        </>
      )}
    </section>
  );
}
