import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyOtp } from "@/lib/otp-store";

const verifySchema = z.object({
  phone: z.string().min(10).max(20),
  otp: z.string().length(6),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const verified = await verifyOtp(parsed.data.phone, parsed.data.otp);
  if (!verified) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  return NextResponse.json({ message: "OTP verified" });
}

