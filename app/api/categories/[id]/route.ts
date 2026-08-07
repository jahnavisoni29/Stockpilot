import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const productsUsingCategory = await Product.countDocuments({ category: id });
  if (productsUsingCategory > 0) {
    return NextResponse.json(
      { error: "Cannot delete category with existing products" },
      { status: 409 }
    );
  }

  await Category.findByIdAndDelete(id);
  return NextResponse.json({ message: "Category deleted" });
}