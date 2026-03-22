import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Full-bleed within a constrained main — pair with `overflow-x-hidden` on body. */
export default function HomeBreakout({ children, className = "" }: Props) {
  return (
    <div
      className={`relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 ${className}`}
    >
      {children}
    </div>
  );
}
