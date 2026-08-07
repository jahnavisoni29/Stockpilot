import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  const productsUsingCategory = await Product.countDocuments({ category: params.id });
  if (productsUsingCategory > 0) {
    return NextResponse.json(
      { error: "Cannot delete category with existing products" },
      { status: 409 }
    );
  }

  await Category.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Category deleted" });
}