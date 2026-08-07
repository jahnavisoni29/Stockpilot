import mongoose, { Schema, Document } from "mongoose";

export const CATEGORY_COLORS = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
] as const;

export interface ICategory extends Document {
  name: string;
  description?: string;
  color: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: [true, "Name is required"], unique: true, trim: true },
  description: { type: String, maxlength: 200 },
  color: { type: String, enum: CATEGORY_COLORS, default: "gray" },
});

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);