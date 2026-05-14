import { dbQuery, hasDatabase } from "@/lib/db";

export type EmployerBillingSummary = {
  /** Combined remaining publishes from post_credit + volume_pack entitlements */
  prepaidPublishesRemaining: number;
  monthlyPassActive: boolean;
  monthlyPassEndsAt: string | null;
  maxLivePosts: number;
  publishedLiveCount: number;
};

function parseRef(ref: string | null): Record<string, unknown> {
  if (!ref) return {};
  try {
    return JSON.parse(ref) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function getEmployerBillingSummary(
  userId: string,
): Promise<EmployerBillingSummary | null> {
  if (!hasDatabase()) {
    return {
      prepaidPublishesRemaining: 999,
      monthlyPassActive: true,
      monthlyPassEndsAt: null,
      maxLivePosts: 99,
      publishedLiveCount: 0,
    };
  }

  const entRows = await dbQuery<{
    id: string;
    entitlement_type: string;
    entitlement_ref: string | null;
    ends_at: string | null;
    used: string;
  }>(
    `select e.id, e.entitlement_type, e.entitlement_ref, e.ends_at::text as ends_at,
            (select count(*)::text from entitlement_usages eu where eu.entitlement_id = e.id) as used
     from entitlements e
     where e.owner_user_id = $1::uuid and e.status = 'active'
       and (e.ends_at is null or e.ends_at > now())`,
    [userId],
  );

  let prepaid = 0;
  let passEnds: string | null = null;
  let passActive = false;
  let maxLive = 2;

  for (const row of entRows) {
    if (row.entitlement_type === "monthly_pass") {
      passActive = true;
      passEnds = row.ends_at;
      const ref = parseRef(row.entitlement_ref);
      if (typeof ref.max_live_posts === "number") maxLive = ref.max_live_posts;
    }
    if (row.entitlement_type === "post_credit" || row.entitlement_type === "volume_pack") {
      const ref = parseRef(row.entitlement_ref);
      const cap = typeof ref.credits === "number" ? ref.credits : 0;
      const used = Number(row.used ?? 0);
      prepaid += Math.max(0, cap - used);
    }
  }

  const liveRows = await dbQuery<{ c: string }>(
    `select count(*)::text as c from jobs j
     inner join employer_profiles ep on ep.id = j.employer_id
     where ep.user_id = $1::uuid and j.status = 'published'`,
    [userId],
  );
  const publishedLiveCount = Number(liveRows[0]?.c ?? 0);

  return {
    prepaidPublishesRemaining: prepaid,
    monthlyPassActive: passActive,
    monthlyPassEndsAt: passEnds,
    maxLivePosts: maxLive,
    publishedLiveCount,
  };
}
