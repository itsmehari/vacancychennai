import { notFound } from "next/navigation";
import { quickApplyAction } from "@/features/applications/actions";
import { getJobById, getLocationById } from "@/features/core/mock-db";

type Props = {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function JobDetailPage({ params, searchParams }: Props) {
  const { jobId } = await params;
  const query = await searchParams;
  const job = getJobById(jobId);
  if (!job || job.status !== "published") notFound();

  const location = getLocationById(job.locationId);
  const jobPostingLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    employmentType: job.jobType.toUpperCase().replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: "Vacancy Chennai Employer",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location?.area,
        addressRegion: "Chennai",
        postalCode: location?.pincode,
        addressCountry: "IN",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: "MONTH",
      },
    },
  };

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        // Safe because the payload is internally generated and serialized.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingLd) }}
      />
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="mt-1 text-slate-700">
          {location?.area}, {location?.zone} · {job.jobType}
        </p>
        <p className="mt-1 text-slate-700">{job.landmarkText}</p>
        <p className="mt-2 font-semibold">
          INR {job.salaryMin.toLocaleString()} - INR {job.salaryMax.toLocaleString()}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-slate-800">{job.description}</p>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Quick apply</h2>
        <p className="mt-1 text-sm text-slate-600">
          No heavy resume needed. Name + phone is enough.
        </p>
        {query.success === "applied" && (
          <p className="mt-3 rounded bg-green-100 px-3 py-2 text-sm text-green-800">
            Application submitted successfully.
          </p>
        )}
        {query.error && (
          <p className="mt-3 rounded bg-red-100 px-3 py-2 text-sm text-red-800">
            Could not submit application. Please check your details.
          </p>
        )}
        <form action={quickApplyAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input type="hidden" name="jobId" value={job.id} />
          <input
            className="rounded border px-3 py-2"
            name="applicantName"
            placeholder="Your full name"
            required
          />
          <input
            className="rounded border px-3 py-2"
            name="applicantPhone"
            placeholder="Phone number"
            required
          />
          <input
            className="rounded border px-3 py-2"
            name="applicantEmail"
            type="email"
            placeholder="Email (optional)"
          />
          <input
            className="rounded border px-3 py-2"
            name="resumeLink"
            placeholder="Resume link (optional)"
          />
          <button
            type="submit"
            className="md:col-span-2 rounded bg-blue-600 px-4 py-2 font-medium text-white"
          >
            Apply now
          </button>
        </form>
      </section>
    </div>
  );
}

