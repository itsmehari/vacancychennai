import Link from "next/link";
import { btnPrimary, btnSecondary } from "@/lib/ui";

const bullets = [
  "Reach candidates who actually live near your workplace — less no-show, faster joins.",
  "Affordable listings and featured options for urgent or high-visibility roles.",
  "Moderation helps keep spam and fake listings off the platform.",
];

export default function HomeEmployersMarketing() {
  return (
    <section
      className="rounded-[var(--radius-lg)] border border-blue-100 bg-gradient-to-br from-blue-50/95 to-slate-50/90 px-6 py-10 shadow-[var(--shadow-card)] md:px-8 md:py-12"
      aria-labelledby="home-employers-heading"
    >
      <div className="border-l-4 border-blue-600 pl-5 md:pl-6">
        <h2
          id="home-employers-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900"
        >
          Hiring in Chennai? Post where locals are already looking
        </h2>
        <p className="mt-3 max-w-3xl text-slate-700">
          Vacancy Chennai is built for SMEs, shops, clinics, logistics, and offices that need
          nearby talent — not a nationwide flood of irrelevant resumes.
        </p>
      </div>
      <ul className="mt-8 space-y-3 text-slate-800">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3 text-sm leading-relaxed md:text-base">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/pricing" className={btnPrimary} data-cta="employers-pricing">
          See employer pricing
        </Link>
        <Link href="/employer/login" className={btnSecondary} data-cta="employers-login">
          Employer login
        </Link>
      </div>
    </section>
  );
}
