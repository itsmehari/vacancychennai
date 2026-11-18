import { formatAdminWhen, listLocalRequestsForAdmin } from "@/features/super-admin/directory";
import { formatPhoneLabel, normalizePhone } from "@/lib/phone";
import { isSuperAdmin } from "@/lib/super-admin-session";
import { sectionCard } from "@/lib/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Local requests | Super admin",
  robots: { index: false, follow: false },
};

export default async function SuperAdminRequestsPage() {
  if (!(await isSuperAdmin())) redirect("/super-admin/login");
  const rows = await listLocalRequestsForAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Local job requests</h1>
        <p className="mt-1 text-sm text-slate-600">
          Posts from neighbourhood pages such as Nanganallur. {rows.length} shown.
        </p>
      </div>
      {rows.length === 0 ? (
        <p className={`${sectionCard} text-sm text-slate-600`}>No local requests on file.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const phone = normalizePhone(row.contactPhone);
            return (
              <li key={row.id} className={sectionCard}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-slate-900">{row.fullName}</p>
                  <p className="text-xs text-slate-500">{formatAdminWhen(row.createdAt)}</p>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {row.areaSlug} · {row.education} · {phone ? formatPhoneLabel(phone) : row.contactPhone}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{row.jobNeeds}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
