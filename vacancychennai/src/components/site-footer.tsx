import Link from "next/link";
import {
  footerBrand,
  footerContact,
  footerLogos,
  footerNewsletter,
  footerSiteLinkColumns,
  footerSocialLinks,
  type FooterSocialId,
} from "@/lib/footer-config";
import {
  focusRingOnAccent,
  focusRingOnDark,
  footerLinkDark,
  transitionFast,
} from "@/lib/ui";

function SocialGlyph({ id, className }: { id: FooterSocialId; className?: string }) {
  const c = className ?? "h-6 w-6";
  if (id === "linkedin") {
    return (
      <svg className={c} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  if (id === "twitter") {
    return (
      <svg className={c} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  return (
    <svg className={c} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const newsletterBtnClass = `inline-flex min-h-[44px] min-w-[5.5rem] items-center justify-center rounded-[var(--radius-md)] border border-white/50 bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20 ${focusRingOnAccent} ${transitionFast}`;

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const activeSocial = footerSocialLinks.filter((s) => s.href.trim().length > 0);

  return (
    <footer className="border-t border-slate-800">
      {/* Tier 1 — site links */}
      <div className="bg-[var(--footer-dark)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            SITE LINKS
          </h2>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {footerSiteLinkColumns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-white">{col.title}</h3>
                <ul className="mt-3 space-y-0">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className={footerLinkDark}
                        data-cta={`footer-${link.href.replace(/\//g, "") || "home"}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2 — optional logos */}
        {footerLogos.length > 0 ? (
          <div className="border-t border-white/10">
            <div className="mx-auto max-w-6xl px-4 py-8">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Hiring partners
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
                {footerLogos.map((logo) => {
                  const inner = logo.imgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element -- partner URLs from config (/public or absolute)
                    <img
                      src={logo.imgSrc}
                      alt={logo.name}
                      className="h-10 w-auto max-w-[140px] object-contain opacity-70 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0 motion-reduce:transition-none"
                    />
                  ) : (
                    <span className="text-sm font-medium text-slate-400">{logo.name}</span>
                  );
                  return logo.href ? (
                    <Link
                      key={logo.name}
                      href={logo.href}
                      className={`${focusRingOnDark} rounded-md`}
                      rel="noopener noreferrer"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div key={logo.name}>{inner}</div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Tier 3 — utility bar */}
      <div className="bg-[var(--footer-accent)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between xl:flex-nowrap xl:items-center">
            <div className="min-w-0 max-w-md">
              <p className="text-lg font-semibold tracking-tight">{footerBrand.name}</p>
              <p className="mt-1 text-sm text-blue-100">{footerBrand.tagline}</p>
              <p className="mt-3 text-xs text-blue-100/90">
                © {year} {footerBrand.name}. All rights reserved.
              </p>
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <Link
                  href="/terms"
                  className={`text-white/90 underline-offset-2 hover:text-white hover:underline ${focusRingOnAccent} rounded-sm ${transitionFast}`}
                >
                  Terms
                </Link>
                <span className="text-blue-200/80" aria-hidden>
                  |
                </span>
                <Link
                  href="/privacy"
                  className={`text-white/90 underline-offset-2 hover:text-white hover:underline ${focusRingOnAccent} rounded-sm ${transitionFast}`}
                >
                  Privacy
                </Link>
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-3 sm:max-w-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">Follow Us</p>
              {activeSocial.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {activeSocial.map((s) => (
                    <a
                      key={s.id}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className={`rounded-md p-1 text-white hover:text-blue-100 ${focusRingOnAccent} ${transitionFast}`}
                    >
                      <SocialGlyph id={s.id} />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-blue-100/80">
                  Social profile links coming soon — see Contact for updates.
                </p>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-3 sm:max-w-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                {footerNewsletter.headline}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={footerNewsletter.textHref}
                  className={newsletterBtnClass}
                  data-cta="footer-newsletter-text"
                  aria-label={`${footerNewsletter.textLabel}: ${footerNewsletter.headline}`}
                >
                  {footerNewsletter.textLabel}
                </Link>
                <Link
                  href={footerNewsletter.emailHref}
                  className={newsletterBtnClass}
                  data-cta="footer-newsletter-email"
                  aria-label={`${footerNewsletter.emailLabel}: ${footerNewsletter.headline}`}
                >
                  {footerNewsletter.emailLabel}
                </Link>
              </div>
            </div>

            <div className="min-w-0 text-sm text-blue-50">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">Contact</p>
              {footerContact.lines.map((line) => (
                <p key={line} className="mt-2 leading-relaxed">
                  {line}
                </p>
              ))}
              {footerContact.phoneHref ? (
                <a
                  href={footerContact.phoneHref}
                  className={`mt-2 inline-block font-medium text-white hover:underline ${focusRingOnAccent} rounded-sm ${transitionFast}`}
                >
                  {footerContact.phoneDisplay}
                </a>
              ) : (
                <p className="mt-2 font-medium tabular-nums text-white">{footerContact.phoneDisplay}</p>
              )}
              <p className="mt-2">
                <Link
                  href="/contact"
                  className={`font-medium text-white underline-offset-2 hover:underline ${focusRingOnAccent} rounded-sm ${transitionFast}`}
                  data-cta="footer-contact-page"
                >
                  Contact page
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
