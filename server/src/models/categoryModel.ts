import mongoose, { Schema, Document } from "mongoose";

// Category document
interface Category extends Document {
  name: string;
}

// Category schema
const categorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensure categories are unique
    },
  },
  {
    timestamps: true,
    collection: "Categories",
  }
);

// Category model
const Category = mongoose.model<Category>("Category", categorySchema);

export default Category;
