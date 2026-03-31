import SiteHeaderShell, { type NavItem } from "@/components/site-header-shell";
import { listLocations } from "@/features/core/repository";
import { getSession } from "@/lib/auth";
import { locationsToMegaAreas, megaSegmentLinks } from "@/lib/nav-config";

export default async function SiteHeader() {
  const [session, locations] = await Promise.all([getSession(), listLocations()]);
  const megaAreas = locationsToMegaAreas(locations);

  const sessionNavItems: NavItem[] = [];
  if (session?.role === "candidate") {
    sessionNavItems.push({ href: "/candidate/dashboard", label: "Dashboard" });
  } else if (session?.role === "employer") {
    sessionNavItems.push(
      { href: "/employer/dashboard", label: "Dashboard" },
      { href: "/employer/resume-database", label: "Resume DB" },
    );
  } else if (session?.role === "admin") {
    sessionNavItems.push(
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/distribution", label: "Distribution" },
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-0 shadow-lg shadow-slate-950/30">
      <SiteHeaderShell
        session={session}
        megaAreas={megaAreas}
        megaSegments={megaSegmentLinks}
        sessionNavItems={sessionNavItems}
      />
    </header>
  );
}
