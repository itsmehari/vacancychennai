import { unlockResumeAction } from "@/features/candidate/actions";
import { candidates, getLocationById } from "@/features/core/mock-db";
import { requireRole } from "@/lib/auth";

type Props = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function ResumeDatabasePage({ searchParams }: Props) {
  await requireRole("employer", "/employer/login");
  const query = await searchParams;

  return (
    <section className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Resume Database (Phase 3)</h1>
      <p className="text-sm text-slate-600">
        Unlock candidate resume/contact visibility with paid credits.
      </p>
      {query.success && (
        <p className="rounded bg-green-100 px-3 py-2 text-sm text-green-800">
          Candidate unlocked.
        </p>
      )}
      {query.error && (
        <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-800">
          Could not unlock candidate.
        </p>
      )}

      <div className="space-y-3">
        {candidates.map((candidate) => {
          const location = getLocationById(candidate.locationId);
          return (
            <article key={candidate.id} className="rounded border p-4">
              <h2 className="font-semibold">{candidate.name}</h2>
              <p className="text-sm text-slate-600">
                {location?.area} · Skills: {candidate.skills.join(", ") || "N/A"}
              </p>
              <p className="text-sm">
                Contact:{" "}
                {candidate.resumeUnlocked ? candidate.phone : "Locked (pay to unlock)"}
              </p>
              <form action={unlockResumeAction} className="mt-2">
                <input type="hidden" name="candidateId" value={candidate.id} />
                <button
                  type="submit"
                  className="rounded bg-indigo-600 px-3 py-1 text-sm text-white"
                >
                  Unlock (INR 99)
                </button>
              </form>
            </article>
          );
        })}
      </div>
    </section>
  );
}

