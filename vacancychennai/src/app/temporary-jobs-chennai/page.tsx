import { JobTypeHubView } from "@/components/discover/job-type-hub-view";
import { getJobTypeHub } from "@/lib/discover/hubs";
import { baseMetadata } from "@/lib/seo";

const hub = getJobTypeHub("temporary")!;

export const metadata = baseMetadata(hub.title, hub.teaser, hub.path);

export default function TemporaryJobsChennaiPage() {
  return <JobTypeHubView jobType="temporary" />;
}
