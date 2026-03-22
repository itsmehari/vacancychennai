import { NextRequest, NextResponse } from "next/server";
import { addAuditLog, addJob, locations } from "@/features/core/mock-db";

type BulkJobPayload = {
  employerId: string;
  jobs: Array<{
    title: string;
    category: string;
    industry: string;
    jobType: "full-time" | "part-time" | "internship" | "contract" | "temporary";
    salaryMin: number;
    salaryMax: number;
    locationId: string;
    landmarkText: string;
    description: string;
  }>;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as BulkJobPayload;
  if (!body?.employerId || !Array.isArray(body.jobs)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const createdIds: string[] = [];
  for (const job of body.jobs) {
    if (!locations.some((location) => location.id === job.locationId)) continue;
    const created = addJob({
      employerId: body.employerId,
      title: job.title,
      category: job.category,
      industry: job.industry,
      jobType: job.jobType,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      locationId: job.locationId,
      landmarkText: job.landmarkText,
      description: job.description,
    });
    createdIds.push(created.id);
  }

  addAuditLog({
    actorRole: "employer",
    actorId: body.employerId,
    action: "create",
    entityType: "bulk_job_post",
    entityId: createdIds.join(","),
  });

  return NextResponse.json({
    message: "Bulk jobs accepted into review queue",
    createdCount: createdIds.length,
    createdIds,
  });
}

