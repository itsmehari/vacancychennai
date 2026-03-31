import type { ReactNode } from "react";

/** Centered auth layout — subtle brand wash behind the card. */
export default function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100dvh-10rem)] flex-col items-center justify-center py-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_50%_at_50%_-15%,rgba(37,99,235,0.09),transparent),radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(251,191,36,0.06),transparent)]"
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-5 flex justify-center" aria-hidden>
          <span className="h-1 w-14 rounded-full bg-gradient-to-r from-amber-400 to-blue-600" />
        </div>
        {children}
      </div>
    </div>
  );
}
