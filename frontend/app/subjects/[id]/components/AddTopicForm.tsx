"use client";

import { FormEvent, useState } from "react";
import { createTopic } from "@/lib/api";

type AddTopicFormProps = {
  subjectId: number;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function AddTopicForm({
  subjectId,
  onSuccess,
  onCancel,
}: AddTopicFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Topic name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createTopic({
        subject_id: subjectId,
        name: name.trim(),
        description: description.trim() || undefined,
        order: Number(order),
        completed: false,
      });

      onSuccess();
    } catch (error) {
      console.error(error);
      setError("Failed to create topic.");
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
          placeholder="e.g. Object Oriented Programming"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What will you learn?"
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
          {loading ? "Adding..." : "Add Topic"}
        </button>
      </div>
    </form>
  );
}