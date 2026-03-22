import { NextRequest, NextResponse } from "next/server";
import { getLocationById, getPublishedJobs } from "@/features/core/mock-db";

export async function GET(request: NextRequest) {
  const zone = request.nextUrl.searchParams.get("zone")?.toLowerCase();
  const jobs = getPublishedJobs()
    .filter((job) => {
      if (!zone) return true;
      const location = getLocationById(job.locationId);
      return location?.zone.toLowerCase().includes(zone);
    })
    .slice(0, 20)
    .map((job) => {
      const location = getLocationById(job.locationId);
      return {
        jobId: job.id,
        whatsappText: `${job.title} | ${location?.area} | INR ${job.salaryMin}-${job.salaryMax} | Apply: ${
          process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in"
        }/jobs/${job.id}`,
      };
    });

  return NextResponse.json({
    message: "WhatsApp distribution payload generated",
    count: jobs.length,
    jobs,
  });
}

