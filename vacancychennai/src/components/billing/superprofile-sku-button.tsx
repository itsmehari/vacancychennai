"use client";

import { useCallback, useState } from "react";
import { btnPrimary } from "@/lib/ui";

type CheckoutResponse = {
  paymentUrl: string;
  orderId: string;
  skuId: string;
  amountPaise: number;
  currency: string;
  instructions?: string;
  error?: string;
};

export function SuperProfileSkuButton({
  skuId,
  label,
  className,
}: {
  skuId: string;
  label: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [lastRef, setLastRef] = useState<string | null>(null);

  const onPay = useCallback(async () => {
    setErr(null);
    setLastRef(null);
    setBusy(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ skuId }),
      });
      const data = (await res.json().catch(() => null)) as CheckoutResponse | null;
      if (!res.ok || !data?.paymentUrl) {
        setErr(
          data?.error === "payments_not_configured"
            ? "Payment link not configured (set SUPERPROFILE_PAYMENT_URL)."
            : "Could not start checkout.",
        );
        return;
      }
      setLastRef(data.orderId);
      window.open(data.paymentUrl, "_blank", "noopener,noreferrer");
    } catch {
      setErr("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }, [skuId]);

  return (
    <div className="space-y-2">
      <button type="button" className={className ?? btnPrimary} disabled={busy} onClick={() => void onPay()}>
        {busy ? "Please wait…" : label}
      </button>
      {lastRef ? (
        <p className="text-xs leading-relaxed text-slate-600">
          Order ref: <code className="rounded bg-slate-100 px-1 font-mono text-[11px]">{lastRef}</code> — use the
          same email on SuperProfile as on Vacancy Chennai. Credits appear after payment is confirmed (usually
          automatically; otherwise contact support with this ref).
        </p>
      ) : null}
      {err ? <p className="text-xs text-red-700">{err}</p> : null}
    </div>
  );
}
