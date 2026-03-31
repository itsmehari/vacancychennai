import type { ReactNode } from "react";

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  /** e.g. “View all” link — rendered on the right on sm+ */
  action?: ReactNode;
  /** Larger title for hero moments (employers strip, etc.) */
  titleLarge?: boolean;
};

export default function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  action,
  titleLarge = false,
}: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={id}
          className={`mt-1 font-semibold tracking-tight text-slate-900 ${titleLarge ? "text-2xl md:text-3xl" : "text-2xl md:text-[1.75rem] leading-tight"}`}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600 md:text-[0.95rem]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 pt-1 sm:pt-0">{action}</div> : null}
    </div>
  );
}
