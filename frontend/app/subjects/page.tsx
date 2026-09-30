import Link from "next/link";
import { getSubjects } from "@/lib/api";

type Subject = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  progress: number;
};

export default async function SubjectsPage() {
  const subjects: Subject[] = await getSubjects();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10">
          <Link
            href="/"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to dashboard
          </Link>

          <h1 className="mt-6 text-3xl font-bold">
            My Subjects
          </h1>

          <p className="mt-2 text-slate-400">
            Choose a subject to view your topics and
            study materials.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/subjects/${subject.id}`}
              className="rounded-2xl border border-slate-800
                         bg-slate-900 p-6 transition
                         hover:-translate-y-1
                         hover:border-blue-500"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center
                             justify-center rounded-xl
                             bg-slate-800 text-3xl"
                >
                  {subject.icon || "📚"}
                </div>

                <div>
                  <h2 className="font-semibold">
                    {subject.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {subject.progress}% complete
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-400">
                {subject.description}
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${subject.progress}%`,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}