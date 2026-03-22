import Link from "next/link";
import { focusRing, footerLink, transitionFast } from "@/lib/ui";

const jobSeekerLinks = [
  { href: "/jobs-in-chennai", label: "All jobs in Chennai" },
  { href: "/freshers-jobs-chennai", label: "Freshers jobs" },
  { href: "/part-time-jobs-chennai", label: "Part-time jobs" },
  { href: "/candidate/login", label: "Candidate login" },
] as const;

const employerLinks = [
  { href: "/employer/login", label: "Employer login" },
  { href: "/pricing", label: "Pricing" },
] as const;

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
] as const;

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Job seekers
            </h2>
            <ul className="mt-3 space-y-0">
              {jobSeekerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={footerLink}
                    data-cta={`footer-${link.href.replace(/\//g, "") || "home"}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Employers
            </h2>
            <ul className="mt-3 space-y-0">
              {employerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLink} data-cta={`footer-${link.href.replace(/\//g, "")}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Company
            </h2>
            <ul className="mt-3 space-y-0">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLink} data-cta={`footer-${link.href.replace(/\//g, "")}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Legal
            </h2>
            <ul className="mt-3 space-y-0">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLink} data-cta={`footer-${link.href.replace(/\//g, "")}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-100 pt-8 text-sm text-slate-600">
          <p>
            <strong className="text-slate-700">Vacancy Chennai</strong> — hyperlocal hiring
            for Chennai and suburbs.
          </p>
          <p className="mt-2">
            Contact: see{" "}
            <Link
              href="/contact"
              className={`font-medium text-blue-700 hover:underline ${focusRing} rounded-sm ${transitionFast}`}
            >
              Contact
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
