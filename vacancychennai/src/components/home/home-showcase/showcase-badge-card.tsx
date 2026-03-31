import Link from "next/link";
import { focusRingOnDark, transitionFast } from "@/lib/ui";
import { SHOWCASE_HREF } from "./showcase-ctas";

export default function ShowcaseBadgeCard() {
  return (
    <div className="relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-3xl border border-indigo-950/50 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-6 text-white shadow-[var(--shadow-card)] md:min-h-[240px]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(1.5px 1.5px at 20% 30%, white, transparent),
            radial-gradient(1.5px 1.5px at 80% 20%, white, transparent),
            radial-gradient(1.5px 1.5px at 40% 80%, white, transparent),
            radial-gradient(1.5px 1.5px at 90% 70%, white, transparent)`,
          backgroundSize: "100% 100%",
        }}
      />
      <div className="relative flex flex-1 flex-col items-center text-center">
        <div
          className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 text-2xl shadow-lg ring-2 ring-white/30"
          aria-hidden
        >
          ⭐
        </div>
        <p className="mt-4 text-lg font-semibold tracking-tight">Nice work, job seeker!</p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-indigo-100">
          You could earn a profile badge when you complete your skills and upload a résumé.
        </p>
        <div className="mt-auto w-full pt-6">
          <Link
            href={SHOWCASE_HREF.candidateLogin}
            className={`inline-flex min-h-[44px] w-full items-center justify-center rounded-full border-2 border-white/80 bg-transparent px-5 py-2 text-sm font-semibold text-white hover:bg-white/10 ${focusRingOnDark} ${transitionFast}`}
            data-cta="showcase-share-profile"
          >
            Share on profile
          </Link>
        </div>
      </div>
    </div>
  );
}
