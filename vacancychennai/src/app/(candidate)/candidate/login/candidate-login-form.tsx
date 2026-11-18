"use client";

import { useFormStatus } from "react-dom";
import { useId } from "react";
import { loginCandidateAction } from "@/features/auth/actions";
import { setCandidatePasswordAction } from "@/features/auth/account-actions";

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
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
  /** When true (Postgres), sign-in requires the password set at registration */
  passwordMode?: boolean;
  nextPath?: string | null;
};

export function CandidateLoginForm({
  showDevNote = false,
  passwordMode = false,
  nextPath = null,
}: FormProps) {
  const emailId = useId();
  const passwordId = useId();
  const fieldClass =
    "w-full rounded border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  if (!passwordMode) {
    return (
      <form action={loginCandidateAction} className="mt-4 space-y-3">
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
        <div className="space-y-1">
          <label htmlFor={emailId} className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id={emailId}
            type="email"
            name="email"
            autoComplete="email"
            className={fieldClass}
            placeholder="you@example.com"
            required
          />
        </div>
        {showDevNote ? (
          <p className="text-xs text-slate-500">
            Demo mode: no password — any registered candidate email works in the mock database.
          </p>
        ) : null}
        <SubmitButton label="Login" pendingLabel="Signing in…" />
      </form>
    );
  }

  return (
    <div className="mt-4 space-y-6">
      <form action={loginCandidateAction} className="space-y-3">
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
        <div className="space-y-1">
          <label htmlFor={emailId} className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id={emailId}
            type="email"
            name="email"
            autoComplete="email"
            className={fieldClass}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor={passwordId} className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id={passwordId}
            type="password"
            name="password"
            autoComplete="current-password"
            className={fieldClass}
            required
            minLength={8}
          />
        </div>
        <SubmitButton label="Sign in" pendingLabel="Signing in…" />
      </form>

      <form action={setCandidatePasswordAction} className="space-y-3 border-t border-slate-100 pt-4">
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
        <p className="text-sm font-medium text-slate-800">Already registered without a password?</p>
        <p className="text-xs text-slate-500">
          Enter the email and mobile number, then choose a password. You will be signed in. If no mobile is
          saved yet, this number is stored on the account.
        </p>
        <input type="email" name="email" required autoComplete="email" placeholder="Email" className={fieldClass} />
        <input type="tel" name="phone" required autoComplete="tel" placeholder="Mobile number on the account" className={fieldClass} />
        <input type="password" name="password" required minLength={8} autoComplete="new-password" placeholder="New password" className={fieldClass} />
        <input type="password" name="passwordConfirm" required minLength={8} autoComplete="new-password" placeholder="Confirm password" className={fieldClass} />
        <SubmitButton label="Save password and sign in" pendingLabel="Saving…" />
      </form>
    </div>
  );
}
