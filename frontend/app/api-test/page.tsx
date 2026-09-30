"use client";

import { useEffect, useState } from "react";

export default function ApiTestPage() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    fetch("http://localhost:8000/api/health")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.status);
      })
      .catch(() => {
        setMessage("Could not connect to backend");
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-10 text-white">
      <h1 className="text-3xl font-bold">
        Backend Connection
      </h1>

      <p className="mt-4 text-slate-400">
        API status:
      </p>

      <p className="mt-2 text-xl text-green-400">
        {message}
      </p>
    </main>
  );
}