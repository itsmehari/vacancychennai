"use client";

import { useFormStatus } from "react-dom";
import { useId, useState } from "react";
import { loginAdminAction } from "@/features/auth/actions";
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

export function AdminLoginForm() {
  const emailId = useId();
  const passwordId = useId();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={loginAdminAction} className="mt-4 space-y-3">
      <div className="space-y-1">
        <label htmlFor={emailId} className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          autoComplete="username"
          className={`min-h-[44px] w-full rounded-[var(--radius-md)] border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 ${focusRing} ${transitionFast}`}
          placeholder="admin@example.com"
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
  );
}
