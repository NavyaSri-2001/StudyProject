"use client";

import { FormEvent, useState } from "react";
import { Topic, updateTopic } from "@/lib/api";

type EditTopicFormProps = {
  topic: Topic;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function EditTopicForm({
  topic,
  onSuccess,
  onCancel,
}: EditTopicFormProps) {
  const [name, setName] = useState(topic.name);
  const [description, setDescription] = useState(
    topic.description ?? ""
  );
  const [order, setOrder] = useState(String(topic.order));
  const [completed, setCompleted] = useState(topic.completed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Topic name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateTopic(topic.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        order: Number(order),
        completed,
      });

      onSuccess();
    } catch (error) {
      console.error(error);
      setError("Failed to update topic.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Topic Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>

        <textarea
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={3}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Order
        </label>

        <input
          type="number"
          min="0"
          value={order}
          onChange={(event) => setOrder(event.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={completed}
          onChange={(event) =>
            setCompleted(event.target.checked)
          }
        />

        <span className="text-sm">
          Mark as completed
        </span>
      </label>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}