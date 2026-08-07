"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("gray");
  const [error, setError] = useState("");

  async function handleSubmit() {
  setError("");

  if (!name.trim()) {
    setError("Name is required");
    return;
  }

  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description, color }),
  });

  if (!res.ok) {
    const data = await res.json();
    setError(data.error || "Something went wrong");
    return;
  }

  setName("");
  setDescription("");
  setColor("gray");
  router.refresh();
}

  return (
    <div className="space-y-3 border p-4 rounded">
      <input
        className="border p-2 w-full"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="border p-2 w-full"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      >
        <option value="gray">Gray</option>
        <option value="red">Red</option>
        <option value="orange">Orange</option>
        <option value="yellow">Yellow</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="purple">Purple</option>
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded">
        Add Category
      </button>
    </div>
  );
}