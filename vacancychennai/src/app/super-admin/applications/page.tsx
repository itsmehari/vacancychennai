import { formatAdminWhen, listApplicationsForAdmin } from "@/features/super-admin/directory";
import { formatPhoneLabel, normalizePhone } from "@/lib/phone";
import { isSuperAdmin } from "@/lib/super-admin-session";
import { linkInline, sectionCard } from "@/lib/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Applications | Super admin",
  robots: { index: false, follow: false },
};

export default async function SuperAdminApplicationsPage() {
  if (!(await isSuperAdmin())) redirect("/super-admin/login");
  const rows = await listApplicationsForAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="mt-1 text-sm text-slate-600">
          {rows.length} shown, newest first. Quick apply is stored here. Email, phone, and WhatsApp listings
          are not, because those go straight to the employer.
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
                      {row.applicantName}
                      {row.applicantEmail ? <p className="text-xs text-slate-500">{row.applicantEmail}</p> : null}
                    </td>
                    <td className="py-2 pr-3">
                      {row.accountName ? (
                        <>
                          {row.accountName}
                          {row.accountEmail ? <p className="text-xs text-slate-500">{row.accountEmail}</p> : null}
                        </>
                      ) : (
                        <span className="text-slate-500">Guest — not signed in</span>
                      )}
                    </td>
                    <td className="py-2 pr-3">{phone ? formatPhoneLabel(phone) : row.applicantPhone}</td>
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
