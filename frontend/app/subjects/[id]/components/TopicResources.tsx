"use client";

import { useEffect, useState } from "react";

import {
  createResource,
  deleteResource,
  getResources,
  Resource,
  updateResource,
} from "@/lib/api";

type TopicResourcesProps = {
  topicId: number;
};

const RESOURCE_TYPES = [
  "YouTube",
  "Website",
  "Documentation",
  "PDF",
  "Article",
  "Image",
  "Other",
];

export default function TopicResources({
  topicId,
}: TopicResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] =
    useState<Resource | null>(null);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Website");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  async function loadResources() {
    try {
      setLoading(true);

      const data = await getResources(topicId);

      setResources(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResources();
  }, [topicId]);

  function openCreateForm() {
    setEditingResource(null);
    setTitle("");
    setType("Website");
    setUrl("");
    setDescription("");
    setShowForm(true);
  }

  function openEditForm(resource: Resource) {
    setEditingResource(resource);
    setTitle(resource.title);
    setType(resource.type);
    setUrl(resource.url);
    setDescription(resource.description ?? "");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingResource(null);
    setTitle("");
    setType("Website");
    setUrl("");
    setDescription("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim() || !url.trim()) {
      return;
    }

    try {
      if (editingResource) {
        await updateResource(editingResource.id, {
          title: title.trim(),
          type,
          url: url.trim(),
          description:
            description.trim() || undefined,
        });
      } else {
        await createResource({
          topic_id: topicId,
          title: title.trim(),
          type,
          url: url.trim(),
          description:
            description.trim() || undefined,
        });
      }

      closeForm();
      await loadResources();
    } catch (error) {
      console.error(error);
      alert("Failed to save resource.");
    }
  }

  async function handleDelete(resource: Resource) {
    const confirmed = window.confirm(
      `Delete "${resource.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteResource(resource.id);

      setResources((currentResources) =>
        currentResources.filter(
          (item) => item.id !== resource.id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete resource.");
    }
  }

  if (loading) {
    return (
      <div className="mt-4 pl-9 text-sm text-gray-400">
        Loading resources...
      </div>
    );
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          Resources
        </h4>

        <button
          onClick={openCreateForm}
          className="rounded-md border px-3 py-1 text-xs"
        >
          + Add Resource
        </button>
      </div>

      {resources.length === 0 ? (
        <p className="text-sm text-gray-400">
          No resources for this topic yet.
        </p>
      ) : (
        <div className="space-y-2">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-lg bg-gray-50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-xs">
                      {resource.type}
                    </span>

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {resource.title}
                    </a>
                  </div>

                  {resource.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {resource.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() =>
                      openEditForm(resource)
                    }
                    className="text-xs text-gray-600 hover:text-black"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(resource)
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
            {editingResource
              ? "Edit Resource"
              : "Add Resource"}
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
              placeholder="Resource title"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              {RESOURCE_TYPES.map((resourceType) => (
                <option
                  key={resourceType}
                  value={resourceType}
                >
                  {resourceType}
                </option>
              ))}
            </select>

            <input
              type="url"
              value={url}
              onChange={(event) =>
                setUrl(event.target.value)
              }
              placeholder="https://example.com"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="What is this resource useful for?"
              rows={3}
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
                {editingResource
                  ? "Save Changes"
                  : "Add Resource"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}