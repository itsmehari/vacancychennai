import { NextRequest, NextResponse } from "next/server";
import { suggestCandidatesForJob } from "@/features/core/mock-db";

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  const suggestions = suggestCandidatesForJob(jobId).map((result) => ({
    candidateId: result.candidate.id,
    name: result.candidate.name,
    score: result.score,
    locationId: result.candidate.locationId,
    skills: result.candidate.skills,
  }));

  return NextResponse.json({
    message: "AI match suggestions generated",
    jobId,
    suggestions,
  });
}

