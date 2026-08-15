import { logger } from "@/lib/logger";
import { isTwilioConfigured, sendTwilioSms } from "@/lib/sms/twilio-sms";
import { storeOtp } from "@/lib/otp-store";

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendLoginOtp(phoneE164: string): Promise<{ devOtp?: string }> {
  const useTwilio = isTwilioConfigured();
  const otp = useTwilio || process.env.NODE_ENV === "production" ? generateOtpCode() : "123456";

  await storeOtp(phoneE164, otp);

  if (!useTwilio) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Twilio is not configured for SMS OTP");
    }
    return { devOtp: otp };
  }

  try {
    await sendTwilioSms(
      phoneE164,
      `Your Vacancy Chennai sign-in code is ${otp}. Valid for 5 minutes.`,
    );
  } catch (e) {
    logger.warn({ err: e, phone: phoneE164 }, "OTP SMS send failed");
    throw e;
  }

  return {};
}
