import {
  listApplicationsForAdmin,
  listEmployersForAdmin,
  listLocalRequestsForAdmin,
  listSeekersForAdmin,
} from "@/features/super-admin/directory";
import { listAllJobs } from "@/features/core/repository";
import { listQuickJobPosts } from "@/features/quick-job-post/repository";
import { curatedPublishedJobs } from "@/features/core/static-curated-jobs";
import { isSuperAdmin } from "@/lib/super-admin-session";
import { sectionCard } from "@/lib/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Super admin | Vacancy Chennai",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function SuperAdminOverviewPage({ searchParams }: Props) {
  if (!(await isSuperAdmin())) redirect("/super-admin/login");
  const query = await searchParams;
  if (query.status) {
    redirect(`/super-admin/inbox?status=${encodeURIComponent(query.status)}`);
  }

  const [seekers, employers, applications, requests, pastedNew, dbJobs] = await Promise.all([
    listSeekersForAdmin(),
    listEmployersForAdmin(),
    listApplicationsForAdmin(),
    listLocalRequestsForAdmin(),
    listQuickJobPosts("new"),
    listAllJobs(),
  ]);
  const pendingPhones = seekers.filter((row) => row.phoneVerificationStatus === "pending" && row.phone).length;
  const contactReady = seekers.filter((row) => row.contactReady).length;
  const jobIds = new Set(dbJobs.map((job) => job.id));
  const catalogOnly = curatedPublishedJobs.filter((job) => !jobIds.has(job.id)).length;

  const cards = [
    { href: "/super-admin/candidates", label: "Job seekers", value: seekers.length, note: `${contactReady} can view contact` },
    { href: "/super-admin/candidates", label: "Mobiles awaiting review", value: pendingPhones, note: "Number on file, not yet checked" },
    { href: "/super-admin/jobs", label: "Jobs", value: dbJobs.length + catalogOnly, note: `${dbJobs.length} records · ${catalogOnly} catalog` },
    { href: "/super-admin/applications", label: "Applications", value: applications.length, note: "Latest 300 when the database is on" },
    { href: "/super-admin/employers", label: "Employers", value: employers.length, note: "Accounts on file" },
    { href: "/super-admin/requests", label: "Local requests", value: requests.length, note: "Neighbourhood posts" },
    { href: "/super-admin/inbox", label: "New pasted vacancies", value: pastedNew.length, note: "Not published yet" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Super admin</h1>
        <p className="mt-1 text-sm text-slate-600">
          Job seekers, listings, applications, employers, local requests, and pasted vacancies.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.label}>
            <Link href={card.href} className={`${sectionCard} block hover:border-blue-200`}>
              <p className="text-sm font-medium text-slate-600">{card.label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{card.value}</p>
              <p className="mt-1 text-xs text-slate-500">{card.note}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
