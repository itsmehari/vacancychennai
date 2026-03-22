import { updateApplicationStageAction } from "@/features/applications/actions";
import {
  getApplicationsForEmployer,
  jobs,
  locations,
  suggestCandidatesForJob,
} from "@/features/core/mock-db";
import { promoteJobAction, createJobAction } from "@/features/jobs/actions";
import { requireRole } from "@/lib/auth";

type Props = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function EmployerDashboardPage({ searchParams }: Props) {
  const session = await requireRole("employer", "/employer/login");
  const query = await searchParams;
  const myJobs = jobs.filter((job) => job.employerId === session.actorId);
  const myApplications = getApplicationsForEmployer(session.actorId);

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Employer dashboard</h1>
        <p className="text-slate-600">Welcome, {session.displayName}</p>
        {query.success && (
          <p className="mt-3 rounded bg-green-100 px-3 py-2 text-sm text-green-800">
            Action completed successfully.
          </p>
        )}
        {query.error && (
          <p className="mt-3 rounded bg-red-100 px-3 py-2 text-sm text-red-800">
            Could not submit job. Please check required fields.
          </p>
        )}
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Post a job</h2>
        <form action={createJobAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="rounded border px-3 py-2" name="title" placeholder="Job title" required />
          <input className="rounded border px-3 py-2" name="category" placeholder="Category" required />
          <input className="rounded border px-3 py-2" name="industry" placeholder="Industry" required />
          <select className="rounded border px-3 py-2" name="jobType" defaultValue="full-time">
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
            <option value="temporary">Temporary</option>
          </select>
          <input className="rounded border px-3 py-2" name="salaryMin" type="number" placeholder="Salary min" required />
          <input className="rounded border px-3 py-2" name="salaryMax" type="number" placeholder="Salary max" required />
          <select className="rounded border px-3 py-2 md:col-span-2" name="locationId" required>
            <option value="">Select location</option>
            {locations.map((location) => (
              <option value={location.id} key={location.id}>
                {location.area} ({location.zone})
              </option>
            ))}
          </select>
          <input
            className="rounded border px-3 py-2 md:col-span-2"
            name="landmarkText"
            placeholder="Landmark (Near ...)"
            required
          />
          <textarea
            className="min-h-28 rounded border px-3 py-2 md:col-span-2"
            name="description"
            placeholder="Job description"
            required
          />
          <button className="rounded bg-blue-600 px-4 py-2 font-medium text-white md:col-span-2">
            Submit for review
          </button>
        </form>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">My jobs</h2>
        <div className="mt-3 space-y-2">
          {myJobs.map((job) => (
            <div key={job.id} className="rounded border p-3 text-sm">
              <p className="font-semibold">{job.title}</p>
              <p>Status: {job.status} · Tier: {job.listingTier}</p>
              <form action={promoteJobAction} className="mt-2 flex gap-2">
                <input type="hidden" name="jobId" value={job.id} />
                <button
                  className="rounded bg-amber-500 px-3 py-1 text-white"
                  name="tier"
                  value="featured"
                  type="submit"
                >
                  Upgrade Featured (INR 299)
                </button>
                <button
                  className="rounded bg-red-600 px-3 py-1 text-white"
                  name="tier"
                  value="urgent"
                  type="submit"
                >
                  Urgent Pack (INR 999)
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Applicants</h2>
        {myApplications.length === 0 && (
          <p className="mt-2 text-sm text-slate-600">No applications yet.</p>
        )}
        <div className="mt-3 space-y-2">
          {myApplications.map((application) => (
            <div key={application.id} className="rounded border p-3 text-sm">
              <p className="font-semibold">{application.applicantName}</p>
              <p>{application.applicantPhone}</p>
              <p>Stage: {application.stage}</p>
              <form action={updateApplicationStageAction} className="mt-2 flex gap-2">
                <input type="hidden" name="applicationId" value={application.id} />
                <button
                  className="rounded bg-sky-600 px-2 py-1 text-white"
                  type="submit"
                  name="stage"
                  value="screening"
                >
                  Shortlist
                </button>
                <button
                  className="rounded bg-red-600 px-2 py-1 text-white"
                  type="submit"
                  name="stage"
                  value="rejected"
                >
                  Reject
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">AI match suggestions (Phase 3)</h2>
        <p className="text-sm text-slate-600">
          Heuristic suggestions based on location and skill keyword overlap.
        </p>
        <div className="mt-3 space-y-3">
          {myJobs.slice(0, 3).map((job) => (
            <div key={job.id} className="rounded border p-3">
              <p className="font-semibold">{job.title}</p>
              <div className="mt-2 space-y-1 text-sm">
                {suggestCandidatesForJob(job.id).map((result) => (
                  <p key={result.candidate.id}>
                    {result.candidate.name} - score {result.score}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

