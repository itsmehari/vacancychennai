"use client";

import { useFormStatus } from "react-dom";
import { useId } from "react";
import { loginCandidateAction } from "@/features/auth/actions";

function SubmitButton({ magicLinkMode }: { magicLinkMode?: boolean }) {
  const { pending } = useFormStatus();
  const label = magicLinkMode ? "Email me a sign-in link" : "Login";
  const pendingLabel = magicLinkMode ? "Sending link…" : "Signing in…";
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

type FormProps = {
  /** When true, show a short note that demo mode is email-only */
  showDevNote?: boolean;
  /** When true (Postgres), sign-in uses a one-time link emailed to the user */
  magicLinkMode?: boolean;
};

export function CandidateLoginForm({
  showDevNote = false,
  magicLinkMode = false,
}: FormProps) {
  const emailId = useId();

  return (
    <form action={loginCandidateAction} className="mt-4 space-y-3">
      <div className="space-y-1">
        <label htmlFor={emailId} className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="you@example.com"
          required
        />
      </div>
      {showDevNote ? (
        <p className="text-xs text-slate-500">
          Demo mode: no password — any registered candidate email works in the mock database.
        </p>
      ) : magicLinkMode ? (
        <p className="text-xs text-slate-500">
          We’ll email you a one-time sign-in link (about 1 hour to use it). No password needed.
        </p>
      ) : null}
      <SubmitButton magicLinkMode={magicLinkMode} />
    </form>
  );
}
