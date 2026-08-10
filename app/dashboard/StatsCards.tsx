"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalProducts: number;
  totalCategories: number;
  lowStockCount: number;
  totalValue: number;
};

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard-stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  const cards = [
    { label: "Total Products", value: stats.totalProducts },
    { label: "Total Categories", value: stats.totalCategories },
    { label: "Low Stock Items", value: stats.lowStockCount },
    { label: "Inventory Value", value: `₹${stats.totalValue.toFixed(2)}` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="border p-4 rounded">
          <p className="text-sm text-gray-400">{c.label}</p>
          <p className="text-2xl font-bold">{c.value}</p>
        </div>
      ))}
    </div>
  );
}