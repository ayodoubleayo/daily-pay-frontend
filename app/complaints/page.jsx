'use client';
import { useState } from "react";
import { fetchJson } from "@/lib/api";   // ✅ use your global API system

export default function ComplaintsPage() {
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Submitting...");

    try {
      const data = await fetchJson("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      setMsg("Complaint submitted successfully.");
      setText("");
    } catch (err) {
      setMsg(err.message || "Something went wrong.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-3xl font-bold mb-4">Complaints</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="border p-3 rounded"
          rows={6}
          placeholder="Describe your complaint..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button className="bg-red-600 text-white p-2 rounded">
          Submit
        </button>
      </form>

      <p className="mt-3 text-gray-700">{msg}</p>
    </div>
  );
}
