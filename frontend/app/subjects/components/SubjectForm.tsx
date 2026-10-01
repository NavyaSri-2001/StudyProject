"use client";

import { FormEvent, useState } from "react";

import {
  createSubject,
  Subject,
  updateSubject,
} from "@/lib/api";

type SubjectFormProps = {
  subject?: Subject | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function SubjectForm({
  subject,
  onSuccess,
  onCancel,
}: SubjectFormProps) {
  const [name, setName] = useState(
    subject?.name ?? ""
  );

  const [description, setDescription] = useState(
    subject?.description ?? ""
  );

  const [icon, setIcon] = useState(
    subject?.icon ?? "📚"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editing = Boolean(subject);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Subject name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (subject) {
        await updateSubject(subject.id, {
          name: name.trim(),
          description:
            description.trim() || undefined,
          icon: icon.trim() || undefined,
        });
      } else {
        await createSubject({
          name: name.trim(),
          description:
            description.trim() || undefined,
          icon: icon.trim() || undefined,
          progress: 0,
        });
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      setError(
        editing
          ? "Failed to update subject."
          : "Failed to create subject."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">
          Subject Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="e.g. Machine Learning"
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
          placeholder="What are you learning?"
          rows={3}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Icon
        </label>

        <input
          type="text"
          value={icon}
          onChange={(event) =>
            setIcon(event.target.value)
          }
          placeholder="📚"
          maxLength={20}
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
          {loading
            ? "Saving..."
            : editing
              ? "Save Changes"
              : "Add Subject"}
        </button>
      </div>
    </form>
  );
}