import Link from "next/link";
import { btnPrimary, btnSecondary, cardSurface, transitionFast } from "@/lib/ui";

type Props = {
  variant?: "card" | "inline";
  /** e.g. home-hero, job-detail-applied */
  dataCta?: string;
};

export default function JobSeekerProfileCta({ variant = "card", dataCta = "job-seeker-profile-cta" }: Props) {
  if (variant === "inline") {
    return (
      <p className="text-sm text-slate-600">
        <span className="font-medium text-slate-800">Save time on your next apply:</span>{" "}
        <Link
          href="/job-seeker-profile"
          className={`font-semibold text-blue-700 underline-offset-2 hover:text-blue-900 hover:underline`}
          data-cta={dataCta}
        >
          Build your job seeker profile once
        </Link>{" "}
        (résumé + skills), then sign in to update anytime.
      </p>
    );
  }

  return (
    <aside
      className={`${cardSurface} p-6 ${transitionFast} hover:border-blue-200`}
      aria-labelledby={`${dataCta}-heading`}
    >
      <h2 id={`${dataCta}-heading`} className="text-lg font-semibold text-slate-900">
        Stand out beyond a single application
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Add a short headline, your area, experience band, and an optional résumé (PDF or Word, up to 2MB).
        Browsing and applying stay free; your profile is optional and tied to your candidate login.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link href="/job-seeker-profile" className={btnPrimary} data-cta={`${dataCta}-learn`}>
          How it works
        </Link>
        <Link href="/candidate/login" className={btnSecondary} data-cta={`${dataCta}-login`}>
          Candidate login
        </Link>
      </div>
    </aside>
  );
}
