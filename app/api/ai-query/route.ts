import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);

export async function POST(req: Request) {
  await connectDB();
  const { question } = await req.json();

  if (!question || !question.trim()) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  const products = await Product.find().populate("category").lean();
  const categories = await Category.find().lean();

  const inventorySummary = products
    .map((p: any) => `- ${p.name} (SKU: ${p.sku}), category: ${p.category?.name || "none"}, quantity: ${p.quantity}, lowStockThreshold: ${p.lowStockThreshold}, price: ₹${(p.priceInCents / 100).toFixed(2)}`)
    .join("\n");

  const prompt = `You are an inventory assistant for a warehouse management app called StockPilot.
Here is the current inventory data:

${inventorySummary}

Categories: ${categories.map((c: any) => c.name).join(", ")}

Based ONLY on the data above, answer this question concisely and clearly:
"${question}"

If the data doesn't contain enough information to answer, say so honestly instead of guessing.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return NextResponse.json({ answer: result.response.text() });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}