"use client";

import { PendingSubmitButton } from "@/components/auth/pending-submit-button";
import { submitQuickJobPostAction } from "@/features/quick-job-post/actions";
import { btnPrimary, btnSecondary, formInput } from "@/lib/ui";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

const STEPS = ["Phone", "Email", "Vacancy"] as const;

type Props = {
  sent: boolean;
  error?: string;
};

function errorCopy(error?: string) {
  if (error === "phone") return "Enter a valid mobile number. A 10-digit Indian number is enough.";
  if (error === "email") return "Enter a valid email address.";
  if (error === "text") return "Paste the vacancy text. Use at least a few sentences, up to 8,000 characters.";
  if (error === "rate") return "That number has sent several posts recently. Try again later.";
  if (error === "save") return "We could not save that post. Try again in a moment.";
  return null;
}

export default function QuickJobPostForm({ sent, error }: Props) {
  const formId = useId();
  const [startedAt, setStartedAt] = useState("");
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [namedArea, setNamedArea] = useState(false);
  const [namedShift, setNamedShift] = useState(false);
  const [namedPay, setNamedPay] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

  useEffect(() => {
    const node = step === 0 ? phoneRef.current : step === 1 ? emailRef.current : textRef.current;
    node?.focus();
  }, [step]);

  function goNext() {
    if (step === 0) {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10) {
        setStepError("Enter a mobile number with at least 10 digits.");
        return;
      }
    }
    if (step === 1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStepError("Enter an email address like name@company.com.");
      return;
    }
    setStepError(null);
    setStep((current) => Math.min(current + 1, 2));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (step < 2) {
      event.preventDefault();
      goNext();
      return;
    }
    if (description.trim().length < 20) {
      event.preventDefault();
      setStepError("Paste the vacancy. Include the role, the area, and how to apply.");
      return;
    }
    if (!namedArea || !namedShift || !namedPay) {
      event.preventDefault();
      setStepError("Tick the three checks once the text includes the area, the shift or job type, and the pay.");
      return;
    }
  }

  const serverError = errorCopy(error);

  return (
    <div className="mx-auto max-w-xl">
      {sent ? (
        <p
          role="status"
          className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-950 ring-1 ring-emerald-100"
        >
          Received. We review every vacancy before it appears on the site. You can send another below.
        </p>
      ) : null}
      {serverError ? (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-100">
          {serverError}
        </p>
      ) : null}

      <ol className="mb-4 grid grid-cols-3 gap-2" aria-label="Posting steps">
        {STEPS.map((label, index) => {
          const current = index === step;
          const done = index < step;
          return (
            <li
              key={label}
              aria-current={current ? "step" : undefined}
              className={`rounded-full px-2 py-2 text-center text-xs font-semibold sm:text-sm ${
                current
                  ? "bg-blue-600 text-white"
                  : done
                    ? "bg-blue-50 text-blue-800 ring-1 ring-blue-100"
                    : "bg-white text-slate-500 ring-1 ring-slate-200"
              }`}
            >
              {index + 1}. {label}
            </li>
          );
        })}
      </ol>

      <form
        action={submitQuickJobPostAction}
        onSubmit={onSubmit}
        className="relative space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
      >
        <input type="hidden" name="started_at" value={startedAt} />

        <div hidden={step !== 0}>
          <label htmlFor={`${formId}-phone`} className="block text-sm font-semibold text-slate-800">
            Mobile number
            <input
              ref={phoneRef}
              id={`${formId}-phone`}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required={step === 0}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="98765 43210"
              className={`mt-2 ${formInput}`}
            />
          </label>
          <p className="mt-2 text-sm text-slate-500">We use this if we need to confirm the vacancy.</p>
        </div>

        <div hidden={step !== 1}>
          <label htmlFor={`${formId}-email`} className="block text-sm font-semibold text-slate-800">
            Email
            <input
              ref={emailRef}
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required={step === 1}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className={`mt-2 ${formInput}`}
            />
          </label>
          <p className="mt-2 text-sm text-slate-500">Replies about this vacancy go here.</p>
        </div>

        <div hidden={step !== 2}>
          <label htmlFor={`${formId}-text`} className="block text-sm font-semibold text-slate-800">
            Job vacancy text
            <textarea
              ref={textRef}
              id={`${formId}-text`}
              name="description"
              required={step === 2}
              rows={12}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={"Paste the full vacancy here.\n\nExample: Accountant needed in T. Nagar. 2 years experience. Salary 25,000. Call 98xxxxxx."}
              className={`mt-2 min-h-48 resize-y ${formInput}`}
            />
          </label>
          <p className="mt-2 text-sm text-slate-500">
            Paste the same message you would send on WhatsApp. Include role, area, and how to apply.
          </p>
          <fieldset className="mt-4 space-y-2 text-sm text-slate-700">
            <legend className="text-sm font-semibold text-slate-800">Before you send</legend>
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={namedArea}
                onChange={(event) => setNamedArea(event.target.checked)}
              />
              The text names the Chennai area or neighbourhood.
            </label>
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={namedShift}
                onChange={(event) => setNamedShift(event.target.checked)}
              />
              The text names the job type or the shift.
            </label>
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={namedPay}
                onChange={(event) => setNamedPay(event.target.checked)}
              />
              The text gives a pay range, or says pay will be discussed.
            </label>
          </fieldset>
        </div>

        <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`${formId}-hp`}>
            Company website
            <input
              id={`${formId}-hp`}
              name="vc_leave_blank"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </label>
        </div>

        {stepError ? (
          <p role="alert" className="text-sm text-red-700">
            {stepError}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          {step > 0 ? (
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setStepError(null);
                setStep((current) => current - 1);
              }}
            >
              Back
            </button>
          ) : null}
          {step < 2 ? (
            <button type="button" className={btnPrimary} onClick={goNext}>
              Continue
            </button>
          ) : (
            <PendingSubmitButton
              label="Send vacancy"
              pendingLabel="Sending…"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            />
          )}
        </div>
      </form>
    </div>
  );
}
