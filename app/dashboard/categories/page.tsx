import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { CATEGORY_COLOR_MAP } from "@/lib/constants/categoryColors";
import CategoryForm from "./CategoryForm";

export default async function CategoriesPage() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <CategoryForm />
      <ul className="mt-6 space-y-2">
        {categories.map((cat) => (
          <li
            key={cat._id.toString()}
            className="flex items-center gap-3 p-3 border rounded"
          >
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: CATEGORY_COLOR_MAP[cat.color] }}
            />
            <span className="font-medium">{cat.name}</span>
            {cat.description && (
              <span className="text-sm text-gray-500">{cat.description}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}