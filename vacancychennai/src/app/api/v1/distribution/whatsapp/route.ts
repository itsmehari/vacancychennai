import { NextRequest, NextResponse } from "next/server";
import { listLocations, listPublishedJobs } from "@/features/core/repository";

export async function GET(request: NextRequest) {
  const zone = request.nextUrl.searchParams.get("zone")?.toLowerCase();

  const [published, locations] = await Promise.all([listPublishedJobs(), listLocations()]);
  const locById = new Map(locations.map((l) => [l.id, l]));

  const jobs = published
    .filter((job) => {
      if (!zone) return true;
      const location = locById.get(job.locationId);
      return location?.zone.toLowerCase().includes(zone);
    })
    .slice(0, 20)
    .map((job) => {
      const location = locById.get(job.locationId);
      return {
        jobId: job.id,
        whatsappText: `${job.title} | ${location?.area ?? "Chennai"} | INR ${job.salaryMin}-${job.salaryMax} | Apply: ${
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
