import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import EditCategoryForm from "./EditCategoryForm";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const category = await Category.findById(id).lean();

  if (!category) notFound();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <EditCategoryForm category={JSON.parse(JSON.stringify(category))} />
    </div>
  );
}