"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ url }: { url: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete");
      return;
    }
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 text-sm border border-red-300 px-2 py-1 rounded ml-2"
    >
      Delete
    </button>
  );
}