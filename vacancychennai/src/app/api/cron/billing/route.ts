import { NextResponse } from "next/server";
import { runBillingReminders } from "@/lib/billing/run-billing-reminders";

export const runtime = "nodejs";

function authorizeCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  const q = new URL(request.url).searchParams.get("secret");
  return q === secret;
}

export async function GET(request: Request) {
  if (!authorizeCronRequest(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const result = await runBillingReminders();
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
