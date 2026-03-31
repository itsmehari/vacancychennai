import { getCandidateResumeFileKey } from "@/features/core/repository";
import { getSession } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import {
  fetchResumeBlobStream,
  isResumeMemoryMarker,
  isResumeStoredInVercelBlob,
} from "@/lib/resume-blob";
import { getResumeBuffer } from "@/lib/resume-memory-store";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "candidate") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!hasDatabase()) {
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

  const key = await getCandidateResumeFileKey(session.actorId);
  if (!key) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (isResumeMemoryMarker(key)) {
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

  if (isResumeStoredInVercelBlob(key)) {
    const fetched = await fetchResumeBlobStream(key);
    if (!fetched) {
      return new NextResponse("Not found", { status: 404 });
    }
    return new NextResponse(fetched.stream, {
      headers: {
        "Content-Type": fetched.contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fetched.filename)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  return new NextResponse("Not found", { status: 404 });
}
