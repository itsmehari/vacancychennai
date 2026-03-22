"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { logoutAction } from "@/features/auth/actions";
import type { MegaAreaLink, MegaSegmentLink } from "@/lib/nav-config";
import { focusRing, transitionFast } from "@/lib/ui";
import type { UserRole } from "@/types/domain";

export type NavItem = {
  href: string;
  label: string;
};

type SessionLite = { role: UserRole } | null;

type Props = {
  /** Flat list for session-specific or extra links (dashboard, etc.) */
  sessionNavItems: NavItem[];
  megaAreas: MegaAreaLink[];
  megaSegments: MegaSegmentLink[];
  session: SessionLite;
};

const navBtnClass = `rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white ${focusRing} focus-visible:ring-offset-slate-950 ${transitionFast}`;

const megaLinkClass = `group flex flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-900 ${focusRing} focus-visible:ring-offset-white ${transitionFast}`;

export default function SiteHeaderShell({
  sessionNavItems,
  megaAreas,
  megaSegments,
  session,
}: Props) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMegaOpen, setMobileMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavId = useId();
  const megaId = useId();

  const closeMega = useCallback(() => setMegaOpen(false), []);
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileMegaOpen(false);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeMega();
        closeMobile();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeMega, closeMobile]);

  useEffect(() => {
    if (!megaOpen) return;
    function onPointerDown(e: MouseEvent) {
      const el = megaRef.current;
      const btn = megaButtonRef.current;
      if (!el || !btn) return;
      const t = e.target as Node;
      if (!el.contains(t) && !btn.contains(t)) closeMega();
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [megaOpen, closeMega]);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [mobileOpen]);

  return (
    <>
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between gap-3 lg:h-16">
          {/* Logo */}
          <Link
            href="/"
            className={`group flex shrink-0 items-center gap-2.5 rounded-xl ${focusRing} focus-visible:ring-offset-slate-950`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/25 ring-1 ring-white/20">
              <svg
                className="h-5 w-5 text-slate-900"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-white lg:text-lg">
                Vacancy Chennai
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400 sm:block">
                Hyperlocal jobs
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Primary"
          >
            <Link href="/" className={navBtnClass}>
              Home
            </Link>
            <div className="relative">
              <button
                ref={megaButtonRef}
                type="button"
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium ${megaOpen ? "bg-white/15 text-white" : "text-slate-200 hover:bg-white/10 hover:text-white"} ${focusRing} focus-visible:ring-offset-slate-950 ${transitionFast}`}
                aria-expanded={megaOpen}
                aria-haspopup="true"
                aria-controls={megaId}
                onClick={() => setMegaOpen((v) => !v)}
              >
                Find jobs
                <svg
                  className={`h-4 w-4 motion-reduce:transition-none ${megaOpen ? "rotate-180" : ""} ${transitionFast}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>
            <Link href="/pricing" className={navBtnClass}>
              Pricing
            </Link>
            <Link href="/blog" className={navBtnClass}>
              Blog
            </Link>
            {sessionNavItems.map((item) => (
              <Link key={item.href} href={item.href} className={navBtnClass}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-2 lg:flex">
            {!session ? (
              <>
                <Link
                  href="/candidate/login"
                  className={`rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:text-white ${focusRing} focus-visible:ring-offset-slate-950 ${transitionFast}`}
                >
                  Sign in
                </Link>
                <Link
                  href="/employer/login"
                  className={`rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 shadow-md shadow-amber-500/20 hover:bg-amber-300 ${focusRing} focus-visible:ring-offset-slate-950 ${transitionFast}`}
                >
                  Post a job
                </Link>
              </>
            ) : (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className={`rounded-lg border border-white/25 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 ${focusRing} focus-visible:ring-offset-slate-950 ${transitionFast}`}
                >
                  Log out
                </button>
              </form>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/15 bg-white/5 p-2 text-white lg:hidden ${focusRing} focus-visible:ring-offset-slate-950 ${transitionFast}`}
            aria-expanded={mobileOpen}
            aria-controls={mobileNavId}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop megamenu */}
        <div
          ref={megaRef}
          id={megaId}
          className={`absolute left-4 right-4 top-full z-50 mt-0 hidden origin-top rounded-b-2xl border border-slate-200/80 bg-white shadow-2xl ring-1 ring-slate-900/5 motion-reduce:transition-none lg:block ${megaOpen ? "pointer-events-auto visible scale-100 opacity-100" : "pointer-events-none invisible scale-[0.98] opacity-0"} ${transitionFast}`}
          style={{ transitionProperty: "opacity, transform, visibility" }}
          role="region"
          aria-label="Job search options"
          aria-hidden={!megaOpen}
        >
          <div className="grid gap-0 lg:grid-cols-3 lg:divide-x lg:divide-slate-100">
            <div className="p-5 lg:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                By area
              </p>
              <ul className="mt-3 grid gap-1 sm:grid-cols-2 lg:grid-cols-1" role="list">
                {megaAreas.map((a) => (
                  <li key={a.href}>
                    <Link href={a.href} className={megaLinkClass} onClick={closeMega}>
                      <span className="font-medium">{a.area}</span>
                      <span className="text-xs text-slate-500 group-hover:text-blue-700/80">
                        {a.zone}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-slate-100 p-5 lg:border-t-0 lg:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                By situation
              </p>
              <ul className="mt-3 space-y-1" role="list">
                {megaSegments.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className={megaLinkClass} onClick={closeMega}>
                      <span className="font-medium">{s.label}</span>
                      <span className="text-xs text-slate-500 group-hover:text-blue-700/80">
                        {s.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-slate-100 bg-gradient-to-br from-blue-50/80 to-slate-50/50 p-5 lg:border-t-0 lg:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Quick search
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Filter by category, salary range, and job type on the full Chennai listings page.
              </p>
              <Link
                href="/jobs-in-chennai"
                className={`mt-4 inline-flex w-full min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 ${focusRing} ${transitionFast}`}
                onClick={closeMega}
              >
                Open job search
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer + backdrop */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm ${transitionFast} motion-reduce:transition-none ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          aria-label="Close menu"
          onClick={closeMobile}
        />
        <div
          id={mobileNavId}
          className={`absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-white shadow-2xl motion-reduce:transition-none ${transitionFast} ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
            <span className="text-lg font-bold text-slate-900">Menu</span>
            <button
              type="button"
              className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 ${focusRing}`}
              onClick={closeMobile}
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Mobile primary">
            <Link
              href="/"
              className="block rounded-xl px-3 py-3 text-base font-medium text-slate-900 hover:bg-slate-50"
              onClick={closeMobile}
            >
              Home
            </Link>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-base font-medium text-slate-900 hover:bg-slate-50"
              aria-expanded={mobileMegaOpen}
              onClick={() => setMobileMegaOpen((v) => !v)}
            >
              Find jobs
              <svg
                className={`h-5 w-5 shrink-0 text-slate-500 ${mobileMegaOpen ? "rotate-180" : ""} ${transitionFast}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {mobileMegaOpen ? (
              <div className="ml-2 border-l-2 border-blue-100 pl-3">
                <p className="px-2 py-1 text-xs font-semibold uppercase text-slate-500">Areas</p>
                {megaAreas.map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="block rounded-lg px-2 py-2.5 text-sm text-slate-700 hover:bg-blue-50"
                    onClick={closeMobile}
                  >
                    {a.area}
                    <span className="block text-xs text-slate-500">{a.zone}</span>
                  </Link>
                ))}
                <p className="mt-2 px-2 py-1 text-xs font-semibold uppercase text-slate-500">
                  Situations
                </p>
                {megaSegments.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block rounded-lg px-2 py-2.5 text-sm text-slate-700 hover:bg-blue-50"
                    onClick={closeMobile}
                  >
                    {s.label}
                  </Link>
                ))}
                <Link
                  href="/jobs-in-chennai"
                  className="mt-2 block rounded-xl bg-blue-600 px-3 py-3 text-center text-sm font-semibold text-white"
                  onClick={closeMobile}
                >
                  Full job search
                </Link>
              </div>
            ) : null}
            <Link
              href="/pricing"
              className="block rounded-xl px-3 py-3 text-base font-medium text-slate-900 hover:bg-slate-50"
              onClick={closeMobile}
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="block rounded-xl px-3 py-3 text-base font-medium text-slate-900 hover:bg-slate-50"
              onClick={closeMobile}
            >
              Blog
            </Link>
            {sessionNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-3 text-base font-medium text-slate-900 hover:bg-slate-50"
                onClick={closeMobile}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-100 p-4">
            {!session ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/candidate/login"
                  className={`flex min-h-[48px] w-full items-center justify-center rounded-xl border border-slate-200 font-semibold text-slate-800 hover:bg-slate-50 ${focusRing}`}
                  onClick={closeMobile}
                >
                  Sign in
                </Link>
                <Link
                  href="/employer/login"
                  className={`flex min-h-[48px] w-full items-center justify-center rounded-xl bg-amber-400 font-bold text-slate-900 hover:bg-amber-300 ${focusRing}`}
                  onClick={closeMobile}
                >
                  Post a job
                </Link>
                <Link
                  href="/admin/login"
                  className="py-2 text-center text-sm text-slate-500 hover:text-slate-800"
                  onClick={closeMobile}
                >
                  Admin login
                </Link>
              </div>
            ) : (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className={`w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 ${focusRing}`}
                >
                  Log out ({session.role})
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
