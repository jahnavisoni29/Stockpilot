import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {  
  await connectDB();
  const { id } = await params;
  console.log("Received ID:", id, "Length:", id.length);
  const product = await Product.findById(id).populate("category");
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  try {
    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    revalidatePath("/dashboard/products");
    return NextResponse.json(product);
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A product with this SKU already exists" },
        { status: 409 }
      );
    }
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0] as any;
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }
    if (err.name === "CastError") {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    revalidatePath("/dashboard/products");
    return NextResponse.json({ message: "Product deleted" });
  } catch (err: any) {
    if (err.name === "CastError") {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}