"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  deleteTopic,
  getSubject,
  getTopics,
  Subject,
  Topic,
  updateTopic,
} from "@/lib/api";

import AddTopicForm from "./components/AddTopicForm";
import EditTopicForm from "./components/EditTopicForm";
import TopicNotes from "./components/TopicNotes";
import TopicResources from "./components/TopicResources";

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();

  const subjectId = Number(params.id);

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTopic, setEditingTopic] =
    useState<Topic | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [subjectData, topicsData] = await Promise.all([
        getSubject(subjectId),
        getTopics(subjectId),
      ]);

      setSubject(subjectData);
      setTopics(topicsData);
    } catch (error) {
      console.error(error);
      setError("Failed to load subject.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!subjectId) {
      return;
    }

    loadData();
  }, [subjectId]);

  async function handleToggleComplete(topic: Topic) {
    try {
      const updatedTopic = await updateTopic(topic.id, {
        completed: !topic.completed,
      });

      setTopics((currentTopics) =>
        currentTopics.map((item) =>
          item.id === updatedTopic.id
            ? updatedTopic
            : item
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update topic.");
    }
  }

  async function handleDeleteTopic(topic: Topic) {
    const confirmed = window.confirm(
      `Delete "${topic.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTopic(topic.id);

      setTopics((currentTopics) =>
        currentTopics.filter(
          (item) => item.id !== topic.id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete topic.");
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-8">
        <p>Loading...</p>
      </main>
    );
  }

  if (error || !subject) {
    return (
      <main className="mx-auto max-w-5xl p-8">
        <p className="text-red-600">
          {error || "Subject not found."}
        </p>

        <button
          onClick={() => router.push("/subjects")}
          className="mt-4 rounded-lg border px-4 py-2"
        >
          Back to Subjects
        </button>
      </main>
    );
  }

  const completedCount = topics.filter(
    (topic) => topic.completed
  ).length;

  const progress =
    topics.length === 0
      ? 0
      : Math.round(
          (completedCount / topics.length) * 100
        );

  return (
    <main className="mx-auto max-w-5xl p-8">
      {/* Header */}

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => router.push("/subjects")}
            className="mb-4 text-sm text-gray-500 hover:text-black"
          >
            ← Back to Subjects
          </button>

          <div className="flex items-center gap-4">
            <div className="text-5xl">
              {subject.icon || "📚"}
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {subject.name}
              </h1>

              <p className="mt-1 text-gray-600">
                {subject.description}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          + Add Topic
        </button>
      </div>

      {/* Progress */}

      <section className="mb-8 rounded-xl border p-5">
        <div className="mb-2 flex justify-between">
          <span className="font-medium">
            Topic Progress
          </span>

          <span className="text-sm text-gray-500">
            {completedCount} / {topics.length} completed
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-black transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-gray-500">
          {progress}% complete
        </p>
      </section>

      {/* Topics */}

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Topics
        </h2>

        {topics.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-gray-500">
              No topics yet.
            </p>

            <button
              onClick={() => setShowAddForm(true)}
              className="mt-3 rounded-lg border px-4 py-2"
            >
              Add your first topic
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`rounded-xl border p-4 transition ${
                  topic.completed
                    ? "bg-gray-50"
                    : "bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}

                  <input
                    type="checkbox"
                    checked={topic.completed}
                    onChange={() =>
                      handleToggleComplete(topic)
                    }
                    className="mt-1 h-5 w-5"
                  />

                  {/* Topic content */}

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-semibold ${
                        topic.completed
                          ? "text-gray-400 line-through"
                          : ""
                      }`}
                    >
                      {topic.name}
                    </h3>

                    {topic.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {topic.description}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      Order: {topic.order}
                    </p>
                  </div>
                 
                  {/* Actions */}

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditingTopic(topic)
                      }
                      className="rounded-lg border px-3 py-1.5 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteTopic(topic)
                      }
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>

                  <TopicNotes topicId={topic.id} />
                  <TopicResources topicId={topic.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Topic Modal */}

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Add Topic
              </h2>

              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <AddTopicForm
              subjectId={subjectId}
              onSuccess={async () => {
                setShowAddForm(false);
                await loadData();
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Topic Modal */}

      {editingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Edit Topic
              </h2>

              <button
                onClick={() => setEditingTopic(null)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <EditTopicForm
              topic={editingTopic}
              onSuccess={async () => {
                setEditingTopic(null);
                await loadData();
              }}
              onCancel={() => setEditingTopic(null)}
            />
          </div>
        </div>
      )}
    </main>
  );
}