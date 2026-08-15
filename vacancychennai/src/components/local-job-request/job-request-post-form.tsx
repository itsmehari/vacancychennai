import { PendingSubmitButton } from "@/components/auth/pending-submit-button";
import { EXPERIENCE_LEVEL_OPTIONS } from "@/lib/candidate-profile-constants";
import { EDUCATION_OPTIONS, JOB_NEEDS_MAX_LENGTH } from "@/lib/local-job-request-constants";
import { formInput } from "@/lib/ui";
import { submitLocalJobRequestAction } from "@/features/local-job-request/actions";
import type { LocalJobRequest } from "@/types/domain";

type Props = {
  existing?: LocalJobRequest | null;
  defaultPhone?: string;
  defaultName?: string;
};

export function JobRequestPostForm({ existing, defaultPhone, defaultName }: Props) {
  return (
    <form action={submitLocalJobRequestAction} className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-1 text-sm text-slate-700 md:col-span-2">
        <span className="font-medium text-slate-800">Name</span>
        <input
          name="fullName"
          required
          autoComplete="name"
          defaultValue={existing?.fullName ?? defaultName ?? ""}
          className={formInput}
          placeholder="Your full name"
        />
      </label>

      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-800">Date of birth</span>
        <input
          name="dateOfBirth"
          type="date"
          required
          defaultValue={existing?.dateOfBirth ?? ""}
          className={formInput}
        />
      </label>

      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-800">Education</span>
        <select name="education" required defaultValue={existing?.education ?? ""} className={formInput}>
          <option value="" disabled>
            Select education
          </option>
          {EDUCATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-800">Location</span>
        <input
          name="locationText"
          required
          defaultValue={existing?.locationText ?? "Nanganallur"}
          className={formInput}
          placeholder="e.g. Nanganallur, Madipakkam"
        />
      </label>

      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-800">Experience</span>
        <select
          name="experienceLevel"
          required
          defaultValue={existing?.experienceLevel ?? ""}
          className={formInput}
        >
          <option value="" disabled>
            Select experience
          </option>
          {EXPERIENCE_LEVEL_OPTIONS.filter((o) => o.value !== "").map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm text-slate-700 md:col-span-2">
        <span className="font-medium text-slate-800">Type your job needs</span>
        <textarea
          name="jobNeeds"
          required
          rows={5}
          maxLength={JOB_NEEDS_MAX_LENGTH}
          defaultValue={existing?.jobNeeds ?? ""}
          className={`${formInput} min-h-[120px] resize-y py-3`}
          placeholder="Describe the role you want, skills, timing, salary expectation, etc."
        />
      </label>

      <label className="grid gap-1 text-sm text-slate-700 md:col-span-2">
        <span className="font-medium text-slate-800">Contact number (WhatsApp)</span>
        <input
          name="contactPhone"
          type="tel"
          required
          autoComplete="tel"
          defaultValue={existing?.contactPhone?.replace(/^\+91/, "") ?? defaultPhone?.replace(/^\+91/, "") ?? ""}
          className={formInput}
          placeholder="10-digit mobile"
          inputMode="numeric"
        />
        <span className="text-xs text-slate-500">
          Shown on your public post as a WhatsApp button so employers can reach you.
        </span>
      </label>

      <div className="md:col-span-2">
        <PendingSubmitButton
          label={existing ? "Update my job request" : "Post my job request"}
          pendingLabel="Posting…"
          className="w-full rounded-[var(--radius-md)] bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>
    </form>
  );
}
