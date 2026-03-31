import Link from "next/link";
import { unlockResumeAction } from "@/features/candidate/actions";
import { listCandidatesForResumeDb, listLocations } from "@/features/core/repository";
import { requireRole } from "@/lib/auth";
import { linkInline } from "@/lib/ui";

type Props = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function ResumeDatabasePage({ searchParams }: Props) {
  await requireRole("employer", "/employer/login");
  const query = await searchParams;
  const [candidates, locs] = await Promise.all([listCandidatesForResumeDb(), listLocations()]);
  const locById = new Map(locs.map((l) => [l.id, l]));

  return (
    <section className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Resume database</h1>
      <p className="text-sm text-slate-600">
        Candidates who have saved a profile may appear here. <strong>Phone and email stay locked</strong> until
        you use an unlock action (demo / pricing flow). Uploaded résumé <strong>files</strong> are not
        downloadable from this screen today — candidates retrieve their own file when signed in; employers
        see an external résumé link if the candidate provided one on their profile. This is{" "}
        <strong>not</strong> a full talent-pool export — see{" "}
        <Link href="/pricing" className={linkInline}>
          pricing
        </Link>{" "}
        and <Link href="/privacy" className={linkInline}>privacy</Link> for how data is used.
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
        {candidates.length === 0 ? (
          <p className="text-sm text-slate-600">No candidate profiles in this environment yet.</p>
        ) : null}
        {candidates.map((candidate) => {
          const location = candidate.locationId ? locById.get(candidate.locationId) : undefined;
          return (
            <article key={candidate.id} className="rounded border border-slate-200 p-4">
              <h2 className="font-semibold">{candidate.name}</h2>
              {candidate.headline ? (
                <p className="text-sm text-slate-700">{candidate.headline}</p>
              ) : null}
              <p className="text-sm text-slate-600">
                {location ? `${location.area}, ${location.zone}` : "Area not set"}
                {" · "}
                Skills: {candidate.skills.join(", ") || "N/A"}
              </p>
              {(candidate.resumeUrl || candidate.hasUploadedResumeFile) && (
                <p className="text-sm text-slate-600">
                  Résumé:{" "}
                  {candidate.resumeUrl ? (
                    <a href={candidate.resumeUrl} className={linkInline} rel="noopener noreferrer">
                      Link
                    </a>
                  ) : null}
                  {candidate.resumeUrl && candidate.hasUploadedResumeFile ? " · " : null}
                  {candidate.hasUploadedResumeFile ? (
                    <span className="text-slate-500">
                      File uploaded (private storage; candidate session download only — not shown to employers
                      here)
                    </span>
                  ) : null}
                </p>
              )}
              <p className="text-sm">
                Contact:{" "}
                {candidate.resumeUnlocked ? candidate.phone : "Locked (pay to unlock in product flow)"}
              </p>
              <form action={unlockResumeAction} className="mt-2">
                <input type="hidden" name="candidateId" value={candidate.id} />
                <button
                  type="submit"
                  className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                >
                  Unlock (demo)
                </button>
              </form>
            </article>
          );
        })}
      </div>
    </section>
  );
}
