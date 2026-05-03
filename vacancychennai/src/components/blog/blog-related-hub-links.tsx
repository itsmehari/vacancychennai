import Link from "next/link";
import { sectionCard } from "@/lib/ui";

type Props = {
  links: { href: string; label: string }[];
};

export function BlogRelatedHubLinks({ links }: Props) {
  if (!links.length) return null;
  return (
    <nav
      aria-label="Related job hubs"
      className={`${sectionCard} mt-10 border-slate-200/90 bg-white/95 shadow-sm`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Related hubs</p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-blue-800 transition hover:border-blue-200 hover:bg-blue-50/70"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
