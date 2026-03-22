import { dbExecute, dbQuery, hasDatabase } from "@/lib/db";

const otpMemory = new Map<
  string,
  { otp: string; expiresAt: number; attempts: number }
>();

export async function storeOtp(phone: string, otp: string, ttlSeconds = 300) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  if (hasDatabase()) {
    await dbExecute(
      `insert into otp_challenges (phone, otp_code, expires_at, attempts, created_at)
       values ($1, $2, to_timestamp($3 / 1000.0), 0, now())`,
      [phone, otp, expiresAt],
    );
    return;
  }
  otpMemory.set(phone, { otp, expiresAt, attempts: 0 });
}

export async function verifyOtp(phone: string, otp: string) {
  if (hasDatabase()) {
    const rows = await dbQuery<{
      id: string;
      otp_code: string;
      expires_at: string;
      attempts: number;
    }>(
      `select id, otp_code, expires_at, attempts
       from otp_challenges
       where phone = $1
       order by created_at desc
       limit 1`,
      [phone],
    );
    if (!rows[0]) return false;
    const row = rows[0];
    if (new Date(row.expires_at).getTime() < Date.now()) return false;
    if (row.attempts >= 5) return false;
    if (row.otp_code !== otp) {
      await dbExecute(
        `update otp_challenges set attempts = attempts + 1 where id = $1`,
        [row.id],
      );
      return false;
    }
    await dbExecute(`delete from otp_challenges where id = $1`, [row.id]);
    return true;
  }

  const current = otpMemory.get(phone);
  if (!current) return false;
  if (current.expiresAt < Date.now() || current.attempts >= 5) return false;
  if (current.otp !== otp) {
    current.attempts += 1;
    otpMemory.set(phone, current);
    return false;
  }
  otpMemory.delete(phone);
  return true;
}

