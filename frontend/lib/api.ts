const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export type Subject = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  progress: number;
  created_at: string;
};

export type Topic = {
  id: number;
  subject_id: number;
  name: string;
  description: string | null;
  order: number;
  completed: boolean;
  created_at: string;
};


export async function getSubjects(): Promise<Subject[]> {
  const response = await fetch(
    `${API_URL}/api/subjects`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }

  return response.json();
}


export async function getSubject(
  id: number
): Promise<Subject> {
  const response = await fetch(
    `${API_URL}/api/subjects/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch subject");
  }

  return response.json();
}


export async function getTopics(
  subjectId: number
): Promise<Topic[]> {
  const response = await fetch(
    `${API_URL}/api/topics?subject_id=${subjectId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch topics");
  }

  return response.json();
}


export async function createTopic(data: {
  subject_id: number;
  name: string;
  description?: string;
  order?: number;
  completed?: boolean;
}): Promise<Topic> {
  const response = await fetch(
    `${API_URL}/api/topics`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create topic");
  }

  return response.json();
}


export async function deleteTopic(
  topicId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/topics/${topicId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete topic");
  }
}

export async function updateTopic(
  topicId: number,
  data: {
    name?: string;
    description?: string;
    order?: number;
    completed?: boolean;
  }
): Promise<Topic> {
  const response = await fetch(
    `${API_URL}/api/topics/${topicId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update topic");
  }

  return response.json();
}

export type Note = {
  id: number;
  topic_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export async function getNotes(
  topicId: number
): Promise<Note[]> {
  const response = await fetch(
    `${API_URL}/api/notes?topic_id=${topicId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  return response.json();
}

export async function createNote(data: {
  topic_id: number;
  title: string;
  content: string;
}): Promise<Note> {
  const response = await fetch(
    `${API_URL}/api/notes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create note");
  }

  return response.json();
}
export async function updateNote(
  noteId: number,
  data: {
    title?: string;
    content?: string;
  }
): Promise<Note> {
  const response = await fetch(
    `${API_URL}/api/notes/${noteId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update note");
  }

  return response.json();
}

export async function deleteNote(
  noteId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/notes/${noteId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete note");
  }
}

export type Resource = {
  id: number;
  topic_id: number;
  title: string;
  type: string;
  url: string;
  description: string | null;
  created_at: string;
};

export async function getResources(
  topicId: number
): Promise<Resource[]> {
  const response = await fetch(
    `${API_URL}/api/resources?topic_id=${topicId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch resources");
  }

  return response.json();
}

export async function createResource(data: {
  topic_id: number;
  title: string;
  type: string;
  url: string;
  description?: string;
}): Promise<Resource> {
  const response = await fetch(
    `${API_URL}/api/resources`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create resource");
  }

  return response.json();
}

export async function updateResource(
  resourceId: number,
  data: {
    title?: string;
    type?: string;
    url?: string;
    description?: string;
  }
): Promise<Resource> {
  const response = await fetch(
    `${API_URL}/api/resources/${resourceId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update resource");
  }

  return response.json();
}

export async function deleteResource(
  resourceId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/resources/${resourceId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete resource");
  }
}

export async function createSubject(data: {
  name: string;
  description?: string;
  icon?: string;
  progress?: number;
}): Promise<Subject> {
  const response = await fetch(
    `${API_URL}/api/subjects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create subject");
  }

  return response.json();
}


export async function updateSubject(
  subjectId: number,
  data: {
    name?: string;
    description?: string;
    icon?: string;
    progress?: number;
  }
): Promise<Subject> {
  const response = await fetch(
    `${API_URL}/api/subjects/${subjectId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update subject");
  }

  return response.json();
}


export async function deleteSubject(
  subjectId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/subjects/${subjectId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete subject");
  }
}