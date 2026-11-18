import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SuperAdminNav } from "@/components/super-admin/super-admin-nav";
import { isSuperAdmin } from "@/lib/super-admin-session";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Super admin | Vacancy Chennai",
};

export default async function SuperAdminLayout({ children }: { children: ReactNode }) {
  if (!(await isSuperAdmin())) return children;
  return (
    <div className="space-y-6 pb-16">
      <SuperAdminNav />
      {children}
    </div>
  );
}
