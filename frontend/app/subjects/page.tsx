"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deleteSubject,
  getSubjects,
  Subject,
} from "@/lib/api";

import SubjectForm from "./components/SubjectForm";

export default function SubjectsPage() {
  const router = useRouter();

  const [subjects, setSubjects] = useState<Subject[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] =
    useState<Subject | null>(null);

  async function loadSubjects() {
    try {
      setLoading(true);
      setError("");

      const data = await getSubjects();

      setSubjects(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  function openCreateForm() {
    setEditingSubject(null);
    setShowForm(true);
  }

  function openEditForm(subject: Subject) {
    setEditingSubject(subject);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingSubject(null);
  }

  async function handleDelete(subject: Subject) {
    const confirmed = window.confirm(
      `Delete "${subject.name}"?\n\n` +
      "This will also delete all topics, notes, " +
      "and resources belonging to this subject."
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteSubject(subject.id);

      setSubjects((currentSubjects) =>
        currentSubjects.filter(
          (item) => item.id !== subject.id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete subject.");
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-8">
        <p>Loading subjects...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Subjects
          </h1>

          <p className="mt-1 text-gray-600">
            Organize your learning subjects.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          + Add Subject
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Empty state */}

      {subjects.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="text-gray-500">
            You don't have any subjects yet.
          </p>

          <button
            onClick={openCreateForm}
            className="mt-4 rounded-lg border px-4 py-2"
          >
            Add your first subject
          </button>
        </div>
      ) : (
        /* Subject cards */

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="rounded-xl border p-5"
            >
              <button
                onClick={() =>
                  router.push(
                    `/subjects/${subject.id}`
                  )
                }
                className="w-full text-left"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-4xl">
                    {subject.icon || "📚"}
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      {subject.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {subject.progress}% complete
                    </p>
                  </div>
                </div>

                <p className="mb-4 text-sm text-gray-600">
                  {subject.description ||
                    "No description yet."}
                </p>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-black"
                    style={{
                      width: `${subject.progress}%`,
                    }}
                  />
                </div>
              </button>

              <div className="mt-4 flex justify-end gap-2 border-t pt-4">
                <button
                  onClick={() =>
                    openEditForm(subject)
                  }
                  className="rounded-lg border px-3 py-1.5 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(subject)
                  }
                  className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subject modal */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingSubject
                  ? "Edit Subject"
                  : "Add Subject"}
              </h2>

              <button
                onClick={closeForm}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <SubjectForm
              subject={editingSubject}
              onSuccess={async () => {
                closeForm();
                await loadSubjects();
              }}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </main>
  );
}