import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: mongoose.Types.ObjectId;
  quantity: number;
  lowStockThreshold: number;
  priceInCents: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: [true, "Name is required"] },
    sku: { type: String, required: [true, "SKU is required"], unique: true, uppercase: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    lowStockThreshold: { type: Number, required: true, default: 10, min: 0 },
    priceInCents: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);