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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  try {
    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 409 }
      );
    }
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0] as any;
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}