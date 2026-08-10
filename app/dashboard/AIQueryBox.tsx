"use client";

import { useState } from "react";

export default function AiQueryBox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const res = await fetch("/api/ai-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setAnswer(data.answer);
    } catch (err) {
      setError("Failed to reach AI service");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-bold text-lg">Ask StockPilot</h2>
      <input
        className="border p-2 w-full"
        placeholder="e.g. which category has the most low-stock items?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAsk()}
      />
      <button
        onClick={handleAsk}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {answer && <p className="text-sm border-t pt-3">{answer}</p>}
    </div>
  );
}