import type { ReactNode } from "react";
import HomeBreakout from "@/components/home/home-breakout";

export type HomeSectionVariant =
  | "default"
  | "muted"
  | "tint"
  | "trust"
  | "elevated"
  | "plain";

const variantClass: Record<HomeSectionVariant, string> = {
  default: "bg-[var(--color-surface)]",
  muted: "bg-slate-100/95 border-y border-slate-200/90",
  tint: "bg-gradient-to-b from-slate-50 via-white to-blue-50/40 border-y border-slate-200/70",
  trust: "bg-slate-100/90 border-y border-slate-200/80",
  elevated:
    "bg-[var(--color-surface-elevated)] border-y border-slate-200/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]",
  plain: "",
};

type Props = {
  variant?: HomeSectionVariant;
  /** Full-bleed background (edge-to-edge within main) */
  fullBleed?: boolean;
  className?: string;
  children: ReactNode;
};

/** Vertical rhythm from globals.css `--home-section-pad-y` tokens. */
function innerPadClass(fullBleed: boolean) {
  const y =
    "py-[length:var(--home-section-pad-y,3rem)] md:py-[length:var(--home-section-pad-y-md,4rem)]";
  return fullBleed ? `mx-auto max-w-6xl px-4 ${y}` : y;
}

export default function HomeSectionShell({
  variant = "plain",
  fullBleed = false,
  className = "",
  children,
}: Props) {
  const bg = variantClass[variant];
  const content = (
    <div className={`${innerPadClass(fullBleed)} ${className}`}>{children}</div>
  );

  if (fullBleed) {
    return (
      <HomeBreakout className={bg}>
        {content}
      </HomeBreakout>
    );
  }

  return <section className={bg}>{content}</section>;
}
