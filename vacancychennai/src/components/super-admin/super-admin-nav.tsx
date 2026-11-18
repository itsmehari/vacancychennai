"use client";

import { superAdminLogoutAction } from "@/features/super-admin/actions";
import { btnSecondary } from "@/lib/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/super-admin", label: "Overview" },
  { href: "/super-admin/candidates", label: "Job seekers" },
  { href: "/super-admin/jobs", label: "Jobs" },
  { href: "/super-admin/applications", label: "Applications" },
  { href: "/super-admin/employers", label: "Employers" },
  { href: "/super-admin/requests", label: "Local requests" },
  { href: "/super-admin/inbox", label: "Pasted vacancies" },
];

export function SuperAdminNav() {
  const pathname = usePathname();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <nav className="flex flex-wrap gap-2" aria-label="Super admin">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-9 items-center rounded-full px-3 text-sm font-medium ${
                active ? "bg-slate-900 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <form action={superAdminLogoutAction}>
        <button type="submit" className={btnSecondary}>
          Sign out
        </button>
      </form>
    </div>
  );
}
