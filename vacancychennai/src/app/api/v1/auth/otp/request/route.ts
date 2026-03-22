import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRateLimitState, registerFailedAttempt } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { storeOtp } from "@/lib/otp-store";

const requestSchema = z.object({
  phone: z.string().min(10).max(20),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }

  const key = `otp-request:${parsed.data.phone}`;
  const state = getRateLimitState(key);
  if (state.blocked) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const otp = process.env.NODE_ENV === "production" ? "******" : "123456";
  await storeOtp(parsed.data.phone, otp);
  registerFailedAttempt(key, { maxAttempts: 5, blockMs: 5 * 60 * 1000 });

  logger.info(
    { event: "otp.requested", phone: parsed.data.phone },
    "otp request accepted",
  );

  return NextResponse.json({
    message: "OTP sent",
    devOtp: process.env.NODE_ENV === "production" ? undefined : otp,
  });
}

