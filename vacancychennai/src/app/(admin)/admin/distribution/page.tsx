import Link from "next/link";
import { requireRole } from "@/lib/auth";

export default async function AdminDistributionPage() {
  await requireRole("admin", "/admin/login");
  return (
    <section className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Distribution Automation (Phase 3)</h1>
      <p className="text-sm text-slate-600">
        Use these endpoints to generate ready-to-send WhatsApp payloads.
      </p>
      <ul className="space-y-2 text-sm">
        <li>
          <Link className="text-blue-700 underline" href="/api/v1/distribution/whatsapp">
            /api/v1/distribution/whatsapp
          </Link>
        </li>
        <li>
          <Link
            className="text-blue-700 underline"
            href="/api/v1/distribution/whatsapp?zone=omr"
          >
            /api/v1/distribution/whatsapp?zone=omr
          </Link>
        </li>
      </ul>
    </section>
  );
}

