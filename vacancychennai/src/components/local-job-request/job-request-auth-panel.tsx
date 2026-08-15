"use client";

import { useFormStatus } from "react-dom";
import {
  jobRequestMagicLinkAction,
  jobRequestOtpAction,
  jobRequestVerifyOtpAction,
} from "@/features/local-job-request/actions";
import { NANGANALLUR_PAGE_PATH } from "@/lib/local-job-request-constants";
import { formInput, linkInline } from "@/lib/ui";
import Link from "next/link";

type AuthProps = {
  otpStep?: boolean;
  otpPhone?: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
};

function AuthSubmitButtons() {
  const { pending } = useFormStatus();
  const btn =
    "w-full rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 sm:flex-1";
  return (
    <div className="flex flex-col gap-2 sm:flex-row md:col-span-2">
      <button
        type="submit"
        formAction={jobRequestMagicLinkAction}
        disabled={pending}
        className={`${btn} border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50`}
      >
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
      <button
        type="submit"
        formAction={jobRequestOtpAction}
        disabled={pending}
        className={`${btn} bg-blue-600 text-white hover:bg-blue-700`}
      >
        {pending ? "Sending…" : "Send SMS code"}
      </button>
    </div>
  );
}

function OtpSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-[var(--radius-md)] bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Verifying…" : "Verify code & continue"}
    </button>
  );
}

export function JobRequestAuthPanel({
  otpStep,
  otpPhone,
  defaultName,
  defaultEmail,
  defaultPhone,
}: AuthProps) {
  if (otpStep && otpPhone) {
    return (
      <form action={jobRequestVerifyOtpAction} className="grid gap-4">
        <input type="hidden" name="phone" value={otpPhone} />
        <input type="hidden" name="fullName" value={defaultName ?? ""} />
        <input type="hidden" name="email" value={defaultEmail ?? ""} />
        <label className="grid gap-1 text-sm text-slate-700">
          <span className="font-medium text-slate-800">SMS code</span>
          <input
            name="otp"
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            className={formInput}
            placeholder="6-digit code"
          />
        </label>
        <OtpSubmitButton />
        <p className="text-sm text-slate-600">
          <Link href={NANGANALLUR_PAGE_PATH} className={linkInline}>
            Use a different number or email
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-1 text-sm text-slate-700 md:col-span-2">
        <span className="font-medium text-slate-800">Name</span>
        <input
          name="fullName"
          required
          autoComplete="name"
          defaultValue={defaultName ?? ""}
          className={formInput}
        />
      </label>
      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-800">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={defaultEmail ?? ""}
          className={formInput}
        />
      </label>
      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-800">Mobile number</span>
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          defaultValue={defaultPhone?.replace(/^\+91/, "") ?? ""}
          className={formInput}
          placeholder="10-digit mobile"
          inputMode="numeric"
        />
      </label>
      <AuthSubmitButtons />
      <p className="text-xs text-slate-500 md:col-span-2">
        Use email link or SMS code — whichever is easier. One free job request per account.
      </p>
    </form>
  );
}
