import { AdminNav } from "@/components/admin/admin-nav";
import { formatAdminWhen, listApplicationsForAdmin } from "@/features/super-admin/directory";
import { requireRole } from "@/lib/auth";
import { formatPhoneLabel, normalizePhone } from "@/lib/phone";
import { linkInline, sectionCard } from "@/lib/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Applications | Admin | Vacancy Chennai",
  robots: { index: false, follow: false },
};

export default async function AdminApplicationsPage() {
  await requireRole("admin", "/admin/login");
  const rows = await listApplicationsForAdmin();

  return (
    <div className="space-y-4">
      <AdminNav />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="mt-1 text-sm text-slate-600">
          {rows.length} shown, newest first. Quick apply is stored here. Direct email / phone / WhatsApp
          applies go to the employer and are not listed.
        </p>
      </div>
      {rows.length === 0 ? (
        <p className={`${sectionCard} text-sm text-slate-600`}>No applications yet.</p>
      ) : (
        <div className={`${sectionCard} overflow-x-auto`}>
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-3 font-medium">When</th>
                <th className="py-2 pr-3 font-medium">Job</th>
                <th className="py-2 pr-3 font-medium">Applicant</th>
                <th className="py-2 pr-3 font-medium">Account</th>
                <th className="py-2 pr-3 font-medium">Phone</th>
                <th className="py-2 font-medium">Stage</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const phone = normalizePhone(row.applicantPhone);
                return (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="py-2 pr-3 whitespace-nowrap">{formatAdminWhen(row.createdAt)}</td>
                    <td className="py-2 pr-3">
                      <Link href={`/jobs/${row.jobId}`} className={linkInline}>
                        {row.jobTitle}
                      </Link>
                    </td>
                    <td className="py-2 pr-3">
                      <p className="font-medium text-slate-900">{row.applicantName}</p>
                      <p className="text-xs text-slate-500">{row.applicantEmail || "—"}</p>
                    </td>
                    <td className="py-2 pr-3">
                      <p>{row.accountName || "—"}</p>
                      <p className="text-xs text-slate-500">{row.accountEmail || "—"}</p>
                    </td>
                    <td className="py-2 pr-3">
                      {phone ? formatPhoneLabel(phone) : row.applicantPhone || "—"}
                    </td>
                    <td className="py-2">{row.stage}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
