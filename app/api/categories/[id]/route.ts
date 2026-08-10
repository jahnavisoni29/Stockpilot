import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;

  try {
    const productsUsingCategory = await Product.countDocuments({ category: id });
    if (productsUsingCategory > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing products" },
        { status: 409 }
      );
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/products/new");
    revalidatePath("/dashboard/products/[id]/edit", "page");
    return NextResponse.json({ message: "Category deleted" });
  } catch (err: any) {
    if (err.name === "CastError") {
      return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/products/new");
    revalidatePath("/dashboard/products/[id]/edit", "page");
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
    if (err.name === "CastError") {
      return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}