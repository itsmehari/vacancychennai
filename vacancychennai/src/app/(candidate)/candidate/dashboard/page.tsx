import { updateCandidateProfileAction } from "@/features/candidate/actions";
import { applications, getCandidateById, locations } from "@/features/core/mock-db";
import { requireRole } from "@/lib/auth";

type Props = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function CandidateDashboardPage({ searchParams }: Props) {
  const session = await requireRole("candidate", "/candidate/login");
  const query = await searchParams;
  const profile = getCandidateById(session.actorId);
  const myApplications = applications.filter(
    (application) => application.candidateId === session.actorId,
  );

  return (
    <div className="space-y-4">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Candidate dashboard</h1>
        <p className="text-slate-600">Welcome, {session.displayName}</p>
        <p className="mt-1 text-sm text-slate-600">
          Profile completion: {profile?.profileCompleted ? "Completed" : "Pending"}
        </p>
        {query.success && (
          <p className="mt-3 rounded bg-green-100 px-3 py-2 text-sm text-green-800">
            Profile updated.
          </p>
        )}
        {query.error && (
          <p className="mt-3 rounded bg-red-100 px-3 py-2 text-sm text-red-800">
            Could not update profile.
          </p>
        )}
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Complete profile (Phase 2)</h2>
        <form action={updateCandidateProfileAction} className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            name="name"
            defaultValue={profile?.name}
            placeholder="Full name"
            className="rounded border px-3 py-2"
            required
          />
          <select
            name="locationId"
            className="rounded border px-3 py-2"
            defaultValue={profile?.locationId}
            required
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.area} ({location.zone})
              </option>
            ))}
          </select>
          <input
            name="skills"
            defaultValue={(profile?.skills ?? []).join(", ")}
            placeholder="Skills (comma separated)"
            className="rounded border px-3 py-2 md:col-span-2"
          />
          <button className="rounded bg-blue-600 px-4 py-2 text-white md:col-span-2">
            Save profile
          </button>
        </form>
      </section>

      <section className="space-y-2 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">My applications</h2>
        {myApplications.length === 0 && (
          <p className="text-sm text-slate-600">
            No applications yet. Apply from any job page.
          </p>
        )}
        {myApplications.map((application) => (
          <div key={application.id} className="rounded border p-3 text-sm">
            <p>
              Application ID: <strong>{application.id}</strong>
            </p>
            <p>Stage: {application.stage}</p>
            <p>Submitted: {new Date(application.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

