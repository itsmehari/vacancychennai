import DashboardWelcome from "@/components/layout/dashboard-welcome";
import Link from "next/link";
import { updateCandidateProfileAction } from "@/features/candidate/actions";
import {
  getCandidateDashboardProfile,
  listApplicationsForCandidateUser,
  listLocations,
} from "@/features/core/repository";
import { requireRole } from "@/lib/auth";
import { EXPERIENCE_LEVEL_OPTIONS } from "@/lib/candidate-profile-constants";
import { btnPrimary, btnSecondary, focusRing, formInput, linkInline, sectionCard } from "@/lib/ui";

type Props = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

const errorCopy: Record<string, string> = {
  "invalid-profile": "Check your name, area, and experience fields, then try again.",
  "rate-limited": "Too many saves in a short time. Please wait a minute and retry.",
  "resume-too-large": "Résumé must be 2MB or smaller.",
  "resume-bad-type": "Use PDF, DOC, or DOCX only.",
};

export default async function CandidateDashboardPage({ searchParams }: Props) {
  const session = await requireRole("candidate", "/candidate/login");
  const query = await searchParams;
  const [profile, locs, myApplications] = await Promise.all([
    getCandidateDashboardProfile(session.actorId),
    listLocations(),
    listApplicationsForCandidateUser(session.actorId),
  ]);

  if (!profile) {
    return (
      <div className={sectionCard}>
        <p className="text-slate-700">We could not load your profile. Try signing in again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardWelcome title="Candidate dashboard" subtitle={`Welcome, ${session.displayName}`}>
        <p className="mt-2 text-sm text-slate-600">
          Profile completion: {profile.profileCompleted ? "Completed" : "In progress"}
        </p>
        {query.success && (
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
            Profile updated.
          </p>
        )}
        {query.error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100" role="alert">
            {errorCopy[query.error] ?? "Could not update profile."}
          </p>
        )}
      </DashboardWelcome>

      <section className={sectionCard}>
        <h2 className="text-lg font-semibold">Job seeker profile</h2>
        <p className="mt-1 text-sm text-slate-600">
          Résumé files are optional. On this MVP, uploaded files stay in server memory until restart — also
          add a{" "}
          <strong>résumé link</strong> for a stable URL. How we use your data:{" "}
          <Link href="/privacy" className={linkInline}>
            Privacy
          </Link>
          .
        </p>
        <form
          action={updateCandidateProfileAction}
          encType="multipart/form-data"
          className="mt-4 grid gap-3 md:grid-cols-2"
        >
          <input
            name="name"
            defaultValue={profile.name}
            placeholder="Full name"
            className={formInput}
            required
            autoComplete="name"
          />
          <select
            name="locationId"
            className={formInput}
            defaultValue={profile.locationId}
            required
          >
            <option value="" disabled>
              Select area
            </option>
            {locs.map((location) => (
              <option key={location.id} value={location.id}>
                {location.area} ({location.zone})
              </option>
            ))}
          </select>
          <input
            name="headline"
            defaultValue={profile.headline}
            placeholder="Headline (e.g. BPO executive · Velachery)"
            maxLength={200}
            className={`md:col-span-2 ${formInput}`}
          />
          <label className="md:col-span-2 grid gap-1 text-sm text-slate-700">
            <span className="font-medium text-slate-800">Experience band</span>
            <select
              name="experienceLevel"
              defaultValue={profile.experienceLevel}
              className={formInput}
            >
              {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value || "unset"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <input
            name="skills"
            defaultValue={(profile.skills ?? []).join(", ")}
            placeholder="Skills (comma separated)"
            className={`md:col-span-2 ${formInput}`}
          />
          <label className="md:col-span-2 grid gap-1 text-sm text-slate-700">
            <span className="font-medium text-slate-800">Résumé link (optional)</span>
            <input
              name="resumeUrl"
              type="url"
              defaultValue={profile.resumeUrl}
              placeholder="https://…"
              className={formInput}
            />
          </label>
          <label className="md:col-span-2 grid gap-1 text-sm text-slate-700">
            <span className="font-medium text-slate-800">
              Résumé file (optional, PDF / DOC / DOCX, max 2MB)
            </span>
            <input
              name="resumeFile"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className={`text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-800 ${focusRing}`}
            />
          </label>
          {profile.hasUploadedResumeFile ? (
            <p className="md:col-span-2 text-sm text-slate-600">
              A résumé file is on file. Upload again to replace it, or use{" "}
              <Link href="/api/candidate/resume" className={linkInline}>
                download (signed in)
              </Link>
              .
            </p>
          ) : null}
          <button type="submit" className={`md:col-span-2 ${btnPrimary}`}>
            Save profile
          </button>
        </form>
      </section>

      <section className={`space-y-2 ${sectionCard}`}>
        <h2 className="text-lg font-semibold">My applications</h2>
        {myApplications.length === 0 && (
          <p className="text-sm text-slate-600">
            No applications yet. Apply from any job page.
          </p>
        )}
        {myApplications.map((application) => (
          <div key={application.id} className="rounded-[var(--radius-md)] border border-slate-200/90 bg-slate-50/50 p-4 text-sm">
            <p>
              Application ID: <strong>{application.id}</strong>
            </p>
            <p>Stage: {application.stage}</p>
            <p>Submitted: {new Date(application.createdAt).toLocaleString()}</p>
          </div>
        ))}
        <Link href="/jobs-in-chennai" className={`mt-2 inline-flex ${btnSecondary}`}>
          Browse jobs
        </Link>
      </section>
    </div>
  );
}
