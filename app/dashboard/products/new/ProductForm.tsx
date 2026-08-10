"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState(categories[0]?._id || "");
  const [quantity, setQuantity] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");

    if (!name.trim() || !sku.trim() || !category || !price) {
      setError("All fields except low stock threshold are required");
      return;
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        sku,
        category,
        quantity: Number(quantity),
        lowStockThreshold: Number(lowStockThreshold),
        priceInCents: Math.round(Number(price) * 100),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }

    router.refresh();
    router.push("/dashboard/products");
  }

  return (
    <div className="space-y-3 border p-4 rounded">
      <input className="border p-2 w-full" placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="border p-2 w-full" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
      <select className="border p-2 w-full" value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>
      <input type="number" min="0" className="border p-2 w-full" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      <input type="number" min="0" className="border p-2 w-full" placeholder="Low stock threshold" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(Number(e.target.value))} />
      <input type="number" step="0.01" className="border p-2 w-full" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded">
        Add Product
      </button>
    </div>
  );
}