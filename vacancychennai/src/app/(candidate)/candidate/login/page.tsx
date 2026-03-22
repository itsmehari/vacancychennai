import { loginCandidateAction } from "@/features/auth/actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CandidateLoginPage({ searchParams }: Props) {
  const query = await searchParams;
  return (
    <section className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Candidate login</h1>
      <p className="mt-1 text-sm text-slate-600">
        Demo email: candidate@vacancychennai.in
      </p>
      {query.error && (
        <p className="mt-3 rounded bg-red-100 px-3 py-2 text-sm text-red-800">
          Invalid login details.
        </p>
      )}
      <form action={loginCandidateAction} className="mt-4 space-y-3">
        <input
          type="email"
          name="email"
          className="w-full rounded border px-3 py-2"
          placeholder="Email"
          required
        />
        <button className="w-full rounded bg-blue-600 px-4 py-2 text-white">
          Login
        </button>
      </form>
    </section>
  );
}

