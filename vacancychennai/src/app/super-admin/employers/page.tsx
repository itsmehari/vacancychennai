import { listEmployersForAdmin } from "@/features/super-admin/directory";
import { formatPhoneLabel, normalizePhone } from "@/lib/phone";
import { isSuperAdmin } from "@/lib/super-admin-session";
import { sectionCard } from "@/lib/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Employers | Super admin",
  robots: { index: false, follow: false },
};

export default async function SuperAdminEmployersPage() {
  if (!(await isSuperAdmin())) redirect("/super-admin/login");
  const rows = await listEmployersForAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Employers</h1>
        <p className="mt-1 text-sm text-slate-600">
          {rows.length} employer records. Passwords are not shown here.
        </p>
      </div>
      {rows.length === 0 ? (
        <p className={`${sectionCard} text-sm text-slate-600`}>No employers yet.</p>
      ) : (
        <div className={`${sectionCard} overflow-x-auto`}>
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-3 font-medium">Company</th>
                <th className="py-2 pr-3 font-medium">Contact</th>
                <th className="py-2 pr-3 font-medium">Email</th>
                <th className="py-2 pr-3 font-medium">Phone</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const phone = normalizePhone(row.phone);
                return (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="py-2 pr-3 font-medium text-slate-900">{row.companyName}</td>
                    <td className="py-2 pr-3">{row.contactName || "—"}</td>
                    <td className="py-2 pr-3">{row.email || "—"}</td>
                    <td className="py-2 pr-3">{phone ? formatPhoneLabel(phone) : row.phone || "—"}</td>
                    <td className="py-2">
                      {row.status}
                      {row.verificationStatus ? ` · ${row.verificationStatus}` : ""}
                    </td>
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
