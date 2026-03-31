"use client";

import { useFormStatus } from "react-dom";

type Props = {
  label: string;
  pendingLabel: string;
  className?: string;
};

export function PendingSubmitButton({ label, pendingLabel, className }: Props) {
  const { pending } = useFormStatus();
  const base =
    className ??
    "w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70";
  return (
    <button type="submit" disabled={pending} className={base}>
      {pending ? pendingLabel : label}
    </button>
  );
}
