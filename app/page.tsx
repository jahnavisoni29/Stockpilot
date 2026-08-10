import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Welcome to StockPilot</h1>
      <div className="flex gap-3">
        <Link href="/login" className="bg-black text-white px-4 py-2 rounded">
          Sign In
        </Link>
        <Link href="/register" className="bg-black text-white px-4 py-2 rounded">
          Sign Up
        </Link>
      </div>
    </div>
  );
}