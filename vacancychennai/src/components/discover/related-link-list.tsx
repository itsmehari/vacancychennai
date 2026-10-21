import Link from "next/link";
import { linkInline } from "@/lib/ui";

export function RelatedLinkList({
  links,
  heading = "Related on Vacancy Chennai",
}: {
  links: { href: string; label: string }[];
  heading?: string;
}) {
  if (links.length === 0) return null;
  return (
    <nav className="mt-10" aria-label={heading}>
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">{heading}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkInline}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
