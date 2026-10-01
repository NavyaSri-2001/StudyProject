"use client";

import { useEffect, useState } from "react";

import {
  createNote,
  deleteNote,
  getNotes,
  Note,
  updateNote,
} from "@/lib/api";

type TopicNotesProps = {
  topicId: number;
};

export default function TopicNotes({
  topicId,
}: TopicNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] =
    useState<Note | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function loadNotes() {
    try {
      setLoading(true);

      const data = await getNotes(topicId);

      setNotes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, [topicId]);

  function openCreateForm() {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setShowForm(true);
  }

  function openEditForm(note: Note) {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    try {
      if (editingNote) {
        await updateNote(editingNote.id, {
          title: title.trim(),
          content: content.trim(),
        });
      } else {
        await createNote({
          topic_id: topicId,
          title: title.trim(),
          content: content.trim(),
        });
      }

      closeForm();
      await loadNotes();
    } catch (error) {
      console.error(error);
      alert("Failed to save note.");
    }
  }

  async function handleDelete(note: Note) {
    const confirmed = window.confirm(
      `Delete "${note.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteNote(note.id);

      setNotes((currentNotes) =>
        currentNotes.filter(
          (item) => item.id !== note.id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete note.");
    }
  }

  if (loading) {
    return (
      <div className="mt-4 pl-9 text-sm text-gray-400">
        Loading notes...
      </div>
    );
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          Notes
        </h4>

        <button
          onClick={openCreateForm}
          className="rounded-md border px-3 py-1 text-xs"
        >
          + Add Note
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-gray-400">
          No notes for this topic yet.
        </p>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg bg-gray-50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h5 className="font-medium">
                    {note.title}
                  </h5>

                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                    {note.content}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() =>
                      openEditForm(note)
                    }
                    className="text-xs text-gray-600 hover:text-black"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(note)
                    }
                    className="text-xs text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="mt-4 rounded-lg border p-4">
          <h5 className="mb-4 font-semibold">
            {editingNote
              ? "Edit Note"
              : "Add Note"}
          </h5>

          <form
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Note title"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <textarea
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              placeholder="Write your notes here..."
              rows={6}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-black px-3 py-2 text-sm text-white"
              >
                {editingNote
                  ? "Save Changes"
                  : "Add Note"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}