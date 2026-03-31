import { Resend } from "resend";

export type ResendReady = {
  resend: Resend;
  from: string;
};

export function getResendClient(): ResendReady | null {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!key || !from) {
    return null;
  }
  return { resend: new Resend(key), from };
}

export function requireResendClient(): ResendReady {
  const client = getResendClient();
  if (!client) {
    throw new Error(
      "Email is not configured: set RESEND_API_KEY and RESEND_FROM.",
    );
  }
  return client;
}
