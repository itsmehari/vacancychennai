"use client";

import { useFormStatus } from "react-dom";
import { useId, useState } from "react";
import {
  loginEmployerAction,
  resendEmployerVerificationAction,
} from "@/features/auth/actions";
import { btnPrimary, focusRing, transitionFast } from "@/lib/ui";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${btnPrimary} w-full justify-center disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none`}
    >
      {pending ? "Signing in…" : "Login"}
    </button>
  );
}

type EmployerLoginFormProps = {
  showVerificationResend?: boolean;
};

export function EmployerLoginForm({
  showVerificationResend = false,
}: EmployerLoginFormProps) {
  const emailId = useId();
  const passwordId = useId();
  const resendEmailId = useId();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
    <form action={loginEmployerAction} className="mt-4 space-y-3">
      <div className="space-y-1">
        <label htmlFor={emailId} className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          className={`min-h-[44px] w-full rounded-[var(--radius-md)] border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 ${focusRing} ${transitionFast}`}
          placeholder="you@company.com"
          required
        />
      </div>
      <div className="space-y-1">
        <label htmlFor={passwordId} className="text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id={passwordId}
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          className={`min-h-[44px] w-full rounded-[var(--radius-md)] border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 ${focusRing} ${transitionFast}`}
          placeholder="Enter your password"
          required
        />
        <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className={`size-4 rounded border-slate-300 text-blue-600 ${focusRing}`}
          />
          Show password
        </label>
      </div>
      <SubmitButton />
    </form>
    {showVerificationResend ? (
      <div className="mt-6 border-t border-slate-200 pt-4">
        <p className="text-sm font-medium text-slate-800">Resend verification email</p>
        <p className="mt-1 text-xs text-slate-600">
          Use the same email as your employer account. We only send if the account exists and is still
          unverified.
        </p>
        <form action={resendEmployerVerificationAction} className="mt-3 space-y-2">
          <label htmlFor={resendEmailId} className="sr-only">
            Email for resend
          </label>
          <input
            id={resendEmailId}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            className={`min-h-[44px] w-full rounded-[var(--radius-md)] border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 ${focusRing} ${transitionFast}`}
          />
          <ResendSubmitButton />
        </form>
      </div>
    ) : null}
    </>
  );
}

function ResendSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 ${focusRing} ${transitionFast}`}
    >
      {pending ? "Sending…" : "Send verification email"}
    </button>
  );
}
