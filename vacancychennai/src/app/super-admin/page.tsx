import { superAdminLogoutAction } from "@/features/super-admin/actions";
import { updateQuickJobPostStatusAction } from "@/features/quick-job-post/actions";
import { listQuickJobPosts } from "@/features/quick-job-post/repository";
import { formatPhoneLabel } from "@/lib/phone";
import type { QuickJobStatus } from "@/lib/quick-job-post";
import { isQuickJobStatus } from "@/lib/quick-job-post";
import { isSuperAdmin } from "@/lib/super-admin-session";
import { btnDenseNeutral, btnDenseSuccess, btnDenseWarning, btnSecondary, sectionCard } from "@/lib/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pasted vacancies | Vacancy Chennai",
  robots: { index: false, follow: false },
};

type Filter = QuickJobStatus | "all";

type Props = {
  searchParams: Promise<{ status?: string; updated?: string; error?: string }>;
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: "new", label: "New" },
  { id: "reviewed", label: "Reviewed" },
  { id: "spam", label: "Spam" },
  { id: "all", label: "All" },
];

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

export default async function SuperAdminInboxPage({ searchParams }: Props) {
  if (!(await isSuperAdmin())) redirect("/super-admin/login");
  const query = await searchParams;
  const filter: Filter =
    query.status === "all" || (query.status && isQuickJobStatus(query.status))
      ? (query.status as Filter)
      : "new";
  const posts = await listQuickJobPosts(filter);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pasted vacancies</h1>
          <p className="mt-1 text-sm text-slate-600">
            {posts.length} in this list. These are not published on the site until you decide to use them.
          </p>
        </div>
        <form action={superAdminLogoutAction}>
          <button type="submit" className={btnSecondary}>
            Sign out
          </button>
        </form>
      </div>

      {query.updated === "1" ? (
        <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
          Status updated.
        </p>
      ) : null}
      {query.error === "invalid" ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
          That update could not be applied.
        </p>
      ) : null}

      <nav className="flex flex-wrap gap-2" aria-label="Filter posts">
        {FILTERS.map((item) => {
          const active = item.id === filter;
          return (
            <a
              key={item.id}
              href={item.id === "new" ? "/super-admin" : `/super-admin?status=${item.id}`}
              className={`inline-flex min-h-[36px] items-center rounded-full px-3 text-sm font-medium ${
                active ? "bg-slate-900 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      {posts.length === 0 ? (
        <p className={`${sectionCard} text-sm text-slate-600`}>Nothing in this list.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className={sectionCard}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm text-slate-500">{formatWhen(post.createdAt)}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{post.status}</p>
              </div>
              <p className="mt-3 text-base font-semibold text-slate-900">
                <a href={`tel:${post.phone}`} className="hover:text-blue-800">
                  {formatPhoneLabel(post.phone)}
                </a>
              </p>
              <p className="mt-1 text-sm">
                <a href={`mailto:${post.email}`} className="font-medium text-blue-700 hover:text-blue-900">
                  {post.email}
                </a>
              </p>
              <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 font-sans text-sm text-slate-800 ring-1 ring-slate-100">
                {post.description}
              </pre>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.status !== "reviewed" ? (
                  <form action={updateQuickJobPostStatusAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="status" value="reviewed" />
                    <input type="hidden" name="filter" value={filter} />
                    <button type="submit" className={btnDenseSuccess}>
                      Mark reviewed
                    </button>
                  </form>
                ) : null}
                {post.status !== "spam" ? (
                  <form action={updateQuickJobPostStatusAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="status" value="spam" />
                    <input type="hidden" name="filter" value={filter} />
                    <button type="submit" className={btnDenseWarning}>
                      Mark spam
                    </button>
                  </form>
                ) : null}
                {post.status !== "new" ? (
                  <form action={updateQuickJobPostStatusAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="status" value="new" />
                    <input type="hidden" name="filter" value={filter} />
                    <button type="submit" className={btnDenseNeutral}>
                      Move back to new
                    </button>
                  </form>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
