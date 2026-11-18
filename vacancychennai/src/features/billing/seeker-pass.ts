import { dbQuery, hasDatabase } from "@/lib/db";

export async function getActiveSeekerPass(userId: string): Promise<{ endsAt: string | null } | null> {
  if (!hasDatabase()) return null;
  const rows = await dbQuery<{ ends_at: string | null }>(
    `select ends_at::text as ends_at from entitlements
     where owner_user_id = $1::uuid and status = 'active' and entitlement_type = 'seeker_pass'
       and (ends_at is null or ends_at > now())
     order by coalesce(ends_at, 'infinity'::timestamptz) desc
     limit 1`,
    [userId],
  );
  const row = rows[0];
  if (!row) return null;
  return { endsAt: row.ends_at };
}
