import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { CATEGORY_COLOR_MAP } from "@/lib/constants/categoryColors";
import Link from "next/link";

export default async function ProductsPage() {
  await connectDB();
  const products = await Product.find().populate("category").sort({ createdAt: -1 }).lean();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/dashboard/products/new" className="bg-black text-white px-4 py-2 rounded">
          + Add Product
        </Link>
      </div>
      <ul className="space-y-2">
        {products.map((p: any) => (
          <li key={p._id.toString()} className="flex items-center gap-3 p-3 border rounded">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: CATEGORY_COLOR_MAP[p.category?.color] }}
            />
            <span className="font-medium">{p.name}</span>
            <span className="text-sm text-gray-500">{p.sku}</span>
            <span className="text-sm text-gray-500">Qty: {p.quantity}</span>
            <span className="text-sm text-gray-500">
              ₹{(p.priceInCents / 100).toFixed(2)}
            </span>
            {p.quantity <= p.lowStockThreshold && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded ml-auto">
                Low stock
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}