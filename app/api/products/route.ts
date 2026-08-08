import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";


export async function GET() {
  await connectDB();
  const products = await Product.find().populate("category").sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const product = await Product.create(body);
    revalidatePath("/dashboard/products");
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A product with this SKU already exists" },
        { status: 409 }
      );
    }
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0] as any;
      if (firstError.name === "CastError") {
        return NextResponse.json(
          { error: `Invalid value for ${firstError.path}` },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}