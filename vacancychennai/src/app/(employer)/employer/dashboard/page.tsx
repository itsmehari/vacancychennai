import DashboardWelcome from "@/components/layout/dashboard-welcome";
import Link from "next/link";
import { updateApplicationStageAction } from "@/features/applications/actions";
import {
  listEmployerApplications,
  listJobsForEmployerUser,
  listLocations,
  suggestCandidatesForJobMatches,
} from "@/features/core/repository";
import { promoteJobAction, createJobAction } from "@/features/jobs/actions";
import { requireRole } from "@/lib/auth";
import {
  btnDenseDanger,
  btnDenseSuccess,
  btnDenseWarning,
  btnPrimary,
  formInput,
  sectionCard,
} from "@/lib/ui";

type Props = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function EmployerDashboardPage({ searchParams }: Props) {
  const session = await requireRole("employer", "/employer/login");
  const query = await searchParams;

  const [myJobs, myApplications, locations] = await Promise.all([
    listJobsForEmployerUser(session.actorId),
    listEmployerApplications(session.actorId),
    listLocations(),
  ]);

  const jobMatchBlocks = await Promise.all(
    myJobs.slice(0, 3).map(async (job) => ({
      job,
      matches: await suggestCandidatesForJobMatches(job.id),
    })),
  );

  const successBanner =
    query.success === "job-created" ? (
      <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-950 ring-1 ring-emerald-100">
        <p className="font-medium">Job submitted for review</p>
        <p className="mt-1 leading-relaxed text-emerald-900/95">
          Thanks — your listing is in the moderation queue. It will appear on the public board only after
          our team publishes it. You can track status under <strong>My jobs</strong> below.
        </p>
        <p className="mt-2 text-emerald-900/90">
          <Link href="/jobs-in-chennai" className="font-semibold underline-offset-2 hover:underline">
            Preview how candidates browse jobs
          </Link>
        </p>
      </div>
    ) : query.success === "promoted" ? (
      <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
        Listing upgraded — your job now uses the selected tier.
      </p>
    ) : query.success ? (
      <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
        Action completed successfully.
      </p>
    ) : null;

  return (
    <div className="space-y-6">
      <DashboardWelcome title="Employer dashboard" subtitle={`Welcome, ${session.displayName}`}>
        {successBanner}
        {query.error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            Could not submit job. Please check required fields.
          </p>
        )}
      </DashboardWelcome>

      <section className={sectionCard}>
        <h2 className="text-xl font-semibold text-slate-900">Post a job</h2>
        <form action={createJobAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input className={formInput} name="title" placeholder="Job title" required />
          <input className={formInput} name="category" placeholder="Category" required />
          <input className={formInput} name="industry" placeholder="Industry" required />
          <select className={formInput} name="jobType" defaultValue="full-time">
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
            <option value="temporary">Temporary</option>
          </select>
          <input className={formInput} name="salaryMin" type="number" placeholder="Salary min" required />
          <input className={formInput} name="salaryMax" type="number" placeholder="Salary max" required />
          <select className={`${formInput} md:col-span-2`} name="locationId" required>
            <option value="">Select location</option>
            {locations.map((location) => (
              <option value={location.id} key={location.id}>
                {location.area} ({location.zone})
              </option>
            ))}
          </select>
          <input
            className={`${formInput} md:col-span-2`}
            name="landmarkText"
            placeholder="Landmark (Near ...)"
            required
          />
          <textarea
            className={`min-h-28 ${formInput} md:col-span-2`}
            name="description"
            placeholder="Job description"
            required
          />
          <button type="submit" className={`md:col-span-2 ${btnPrimary}`}>
            Submit for review
          </button>
        </form>
      </section>

      <section className={sectionCard}>
        <h2 className="text-xl font-semibold text-slate-900">My jobs</h2>
        <div className="mt-3 space-y-3">
          {myJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-[var(--radius-md)] border border-slate-200/90 bg-slate-50/40 p-4 text-sm"
            >
              <p className="font-semibold text-slate-900">{job.title}</p>
              <p className="mt-1 text-slate-600">
                Status: {job.status} · Tier: {job.listingTier}
              </p>
              <form action={promoteJobAction} className="mt-3 flex flex-wrap gap-2">
                <input type="hidden" name="jobId" value={job.id} />
                <button className={btnDenseWarning} name="tier" value="featured" type="submit">
                  Upgrade Featured (INR 299)
                </button>
                <button className={btnDenseDanger} name="tier" value="urgent" type="submit">
                  Urgent Pack (INR 999)
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className={sectionCard}>
        <h2 className="text-xl font-semibold text-slate-900">Applicants</h2>
        {myApplications.length === 0 && (
          <p className="mt-2 text-sm text-slate-600">No applications yet.</p>
        )}
        <div className="mt-3 space-y-3">
          {myApplications.map((application) => (
            <div
              key={application.id}
              className="rounded-[var(--radius-md)] border border-slate-200/90 bg-slate-50/40 p-4 text-sm"
            >
              <p className="font-semibold text-slate-900">{application.applicantName}</p>
              <p className="text-slate-700">{application.applicantPhone}</p>
              <p className="text-slate-600">Stage: {application.stage}</p>
              <form action={updateApplicationStageAction} className="mt-3 flex flex-wrap gap-2">
                <input type="hidden" name="applicationId" value={application.id} />
                <button className={btnDenseSuccess} type="submit" name="stage" value="screening">
                  Shortlist
                </button>
                <button className={btnDenseDanger} type="submit" name="stage" value="rejected">
                  Reject
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className={sectionCard}>
        <h2 className="text-xl font-semibold text-slate-900">AI match suggestions (Phase 3)</h2>
        <p className="mt-1 text-sm text-slate-600">
          Heuristic skill/location overlap vs job category — same logic for mock and Postgres-backed
          candidates.
        </p>
        <div className="mt-3 space-y-3">
          {jobMatchBlocks.map(({ job, matches }) => (
            <div key={job.id} className="rounded-[var(--radius-md)] border border-slate-200/80 p-4">
              <p className="font-semibold text-slate-900">{job.title}</p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                {matches.length === 0 ? (
                  <p className="text-slate-500">No scored matches yet.</p>
                ) : (
                  matches.map((result) => (
                    <p key={result.candidate.id}>
                      {result.candidate.name} — score {result.score}
                    </p>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
