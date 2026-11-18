import { AdminNav } from "@/components/admin/admin-nav";
import { setAdminSeekerPhoneVerificationAction } from "@/features/admin/actions";
import { formatAdminWhen, listSeekersForAdmin } from "@/features/super-admin/directory";
import { requireRole } from "@/lib/auth";
import {
  educationLabel,
  jobPreferenceLabel,
  phoneVerificationLabel,
} from "@/lib/candidate-profile-constants";
import { formatPhoneLabel, normalizePhone } from "@/lib/phone";
import { btnDenseNeutral, btnDenseSuccess, btnDenseWarning, sectionCard } from "@/lib/ui";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Candidates | Admin | Vacancy Chennai",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ updated?: string; error?: string }>;
};

export default async function AdminCandidatesPage({ searchParams }: Props) {
  await requireRole("admin", "/admin/login");
  const query = await searchParams;
  const seekers = await listSeekersForAdmin();

  return (
    <div className="space-y-4">
      <AdminNav />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
        <p className="mt-1 text-sm text-slate-600">
          {seekers.length} profiles. Review mobiles and see who can view employer contact details.
        </p>
      </div>
      {query.updated === "1" ? (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100"
        >
          Phone review updated.
        </p>
      ) : null}
      {query.error === "invalid" ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
          That review could not be saved. The seeker needs a profile row first.
        </p>
      ) : null}
      {seekers.length === 0 ? (
        <p className={`${sectionCard} text-sm text-slate-600`}>No candidates yet.</p>
      ) : (
        <ul className="space-y-3">
          {seekers.map((seeker) => (
            <li key={seeker.userId} className={sectionCard}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-base font-semibold text-slate-900">{seeker.name}</p>
                <p className="text-xs text-slate-500">{formatAdminWhen(seeker.createdAt)}</p>
              </div>
              <p className="mt-1 text-sm text-slate-700">{seeker.email || "No email"}</p>
              <p className="text-sm text-slate-700">
                {normalizePhone(seeker.phone)
                  ? formatPhoneLabel(normalizePhone(seeker.phone) as string)
                  : seeker.phone || "No mobile"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {seeker.area || "No area"} ·{" "}
                {seeker.education ? educationLabel(seeker.education) : "No qualification"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {seeker.jobPreferences.length
                  ? seeker.jobPreferences.map((value) => jobPreferenceLabel(value)).join(", ")
                  : "No job preferences"}
              </p>
              <p className="mt-2 text-sm">
                Applications: <strong>{seeker.applicationCount}</strong>
                {" · "}
                Contact access: <strong>{seeker.contactReady ? "Open" : "Locked"}</strong>
                {" · "}
                Mobile:{" "}
                <strong>
                  {seeker.phone ? phoneVerificationLabel(seeker.phoneVerificationStatus) : "Not provided"}
                </strong>
              </p>
              {seeker.phone ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {seeker.phoneVerificationStatus !== "verified" ? (
                    <form action={setAdminSeekerPhoneVerificationAction}>
                      <input type="hidden" name="userId" value={seeker.userId} />
                      <input type="hidden" name="status" value="verified" />
                      <button type="submit" className={btnDenseSuccess}>
                        Mark mobile verified
                      </button>
                    </form>
                  ) : null}
                  {seeker.phoneVerificationStatus !== "pending" ? (
                    <form action={setAdminSeekerPhoneVerificationAction}>
                      <input type="hidden" name="userId" value={seeker.userId} />
                      <input type="hidden" name="status" value="pending" />
                      <button type="submit" className={btnDenseNeutral}>
                        Mark pending
                      </button>
                    </form>
                  ) : null}
                  {seeker.phoneVerificationStatus !== "rejected" ? (
                    <form action={setAdminSeekerPhoneVerificationAction}>
                      <input type="hidden" name="userId" value={seeker.userId} />
                      <input type="hidden" name="status" value="rejected" />
                      <button type="submit" className={btnDenseWarning}>
                        Needs correction
                      </button>
                    </form>
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
