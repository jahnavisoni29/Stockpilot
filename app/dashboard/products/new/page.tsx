import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import ProductForm from "./ProductForm";

export default async function NewProductPage() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <ProductForm categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}