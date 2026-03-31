import { getSession } from "@/lib/auth";
import { getResumeBuffer } from "@/lib/resume-memory-store";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "candidate") {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const entry = getResumeBuffer(session.actorId);
  if (!entry) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(new Uint8Array(entry.buffer), {
    headers: {
      "Content-Type": entry.mime,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(entry.filename)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
