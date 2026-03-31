import type { ReactNode } from "react";
import { sectionCard } from "@/lib/ui";

type Props = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export default function DashboardWelcome({ title, subtitle, children }: Props) {
  return (
    <section className={`${sectionCard} border-l-[3px] border-l-blue-600`}>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle ? <p className="mt-1 text-slate-600">{subtitle}</p> : null}
      {children}
    </section>
  );
}
