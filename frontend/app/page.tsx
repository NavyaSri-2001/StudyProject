import Link from "next/link";
import { getSubjects } from "@/lib/api";

type Subject = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  progress: number;
};

export default async function Home() {
  const subjects: Subject[] = await getSubjects();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <header className="mb-12">
          <p className="mb-2 text-sm font-medium text-blue-400">
            PERSONAL LEARNING SYSTEM
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            My Study Hub
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Organize your subjects, notes, resources,
            projects, and learn with your own AI study
            assistant.
          </p>
        </header>

        <div className="mb-10">
          <input
            type="text"
            placeholder="Search your study materials..."
            className="w-full rounded-xl border border-slate-800
                       bg-slate-900 px-5 py-4 outline-none
                       placeholder:text-slate-500
                       focus:border-blue-500"
          />
        </div>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              My Subjects
            </h2>

            <Link
              href="/subjects"
              className="rounded-lg bg-blue-600 px-4 py-2
                         text-sm font-medium hover:bg-blue-500"
            >
              + Add Subject
            </Link>
          </div>

          {subjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed
                            border-slate-700 p-10 text-center">
              <p className="text-slate-400">
                No subjects yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Add your first subject to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  emoji={subject.icon || "📚"}
                  title={subject.name}
                  description={
                    subject.description || ""
                  }
                  progress={subject.progress}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-12 rounded-2xl border
                            border-slate-800 bg-slate-900 p-8">

          <div className="mb-5 flex items-center gap-3">
            <span className="text-3xl">🤖</span>

            <div>
              <h2 className="text-xl font-semibold">
                AI Study Assistant
              </h2>

              <p className="text-sm text-slate-400">
                Chat with your own study materials.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask something about your studies..."
              className="flex-1 rounded-xl border
                         border-slate-700 bg-slate-950
                         px-4 py-3 outline-none
                         placeholder:text-slate-500"
              disabled
            />

            <button
              disabled
              className="rounded-xl bg-slate-700
                         px-5 py-3 font-medium
                         text-slate-400"
            >
              Ask AI
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}


function SubjectCard({
  emoji,
  title,
  description,
  progress,
}: {
  emoji: string;
  title: string;
  description: string;
  progress: number;
}) {
  return (
    <div
      className="rounded-2xl border border-slate-800
                 bg-slate-900 p-6 transition
                 hover:-translate-y-1
                 hover:border-slate-700"
    >
      <div className="mb-5 flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center
                     justify-center rounded-xl
                     bg-slate-800 text-2xl"
        >
          {emoji}
        </div>

        <div>
          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {progress}% complete
          </p>
        </div>
      </div>

      <p className="mb-5 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}