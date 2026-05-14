import { dbQuery, hasDatabase } from "@/lib/db";

export type PendingPaymentOrderRow = {
  id: string;
  employer_id: string;
  amount_paise: string;
  entitlement_ref: string | null;
  created_at: string;
  employer_email: string | null;
  employer_name: string | null;
};

export async function listPendingSuperProfileOrders(limit = 40): Promise<PendingPaymentOrderRow[]> {
  if (!hasDatabase()) return [];
  return dbQuery<PendingPaymentOrderRow>(
    `select po.id::text, po.employer_id::text, po.amount_paise::text, po.entitlement_ref,
            po.created_at::text as created_at,
            u.email as employer_email, u.full_name as employer_name
     from payment_orders po
     left join users u on u.id = po.employer_id
     where po.provider = 'superprofile' and po.status = 'created'
     order by po.created_at desc
     limit $1::int`,
    [limit],
  );
}
