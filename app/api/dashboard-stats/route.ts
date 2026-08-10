import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET() {
  await connectDB();

  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();

  const lowStockCount = await Product.countDocuments({
    $expr: { $lte: ["$quantity", "$lowStockThreshold"] },
  });

  const valueResult = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalValue: { $sum: { $multiply: ["$quantity", "$priceInCents"] } },
      },
    },
  ]);
  const totalValueInCents = valueResult[0]?.totalValue || 0;

  return NextResponse.json({
    totalProducts,
    totalCategories,
    lowStockCount,
    totalValue: totalValueInCents / 100,
  });
}