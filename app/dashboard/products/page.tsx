import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { CATEGORY_COLOR_MAP } from "@/lib/constants/categoryColors";
import Link from "next/link";
import DeleteButton from "@/app/dashboard/DeleteButton";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  await connectDB();
  const { q, category } = await searchParams;

  const filter: any = {};
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { sku: { $regex: q, $options: "i" } },
    ];
  }
  if (category) {
    filter.category = category;
  }

  const products = await Product.find(filter).populate("category").sort({ createdAt: -1 }).lean();
  const categories = await Category.find().sort({ name: 1 }).lean();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/dashboard/products/new" className="bg-black text-white px-4 py-2 rounded">
          + Add Product
        </Link>
      </div>

      <form method="GET" className="flex gap-2 mb-4">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name or SKU..."
          className="border p-2 flex-1"
        />
        <select name="category" defaultValue={category || ""} className="border p-2">
          <option value="">All categories</option>
          {categories.map((c: any) => (
            <option key={c._id.toString()} value={c._id.toString()}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Filter
        </button>
        {(q || category) && (
          <Link href="/dashboard/products" className="border px-4 py-2 rounded">
            Clear
          </Link>
        )}
      </form>

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
            <Link href={`/dashboard/products/${p._id}/edit`} className="text-blue-500 text-sm ml-auto">
                Edit
            </Link>
            <DeleteButton url={`/api/products/${p._id}`} />
          </li>
        ))}
      </ul>

      {products.length === 0 && (
        <p className="text-gray-500 text-sm mt-4">No products match your search.</p>
      )}
    </div>
  );
}