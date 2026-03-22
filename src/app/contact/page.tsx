import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata(
  "Contact Vacancy Chennai",
  "Contact the Vacancy Chennai team.",
  "/contact",
);

export default function ContactPage() {
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-3 text-slate-700">Email: support@vacancychennai.in</p>
      <p className="text-slate-700">WhatsApp: +91-90000-00000</p>
    </section>
  );
}

