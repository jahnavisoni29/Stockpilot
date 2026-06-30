"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome to StockPilot Dashboard</h1>
      <p>Name: {session?.user?.name}</p>
      <p>Role: {session?.user?.role}</p>
    </div>
  );
}