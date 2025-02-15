import mongoose, { Schema, Document } from "mongoose";

export enum TaskPopulationFields {
  CATEGORY = "category",
  CATEGORY_NAME = "categoryName",
  CATEGORY_ID = "_id",
}

// Category document
interface Category extends Document {
  categoryName: string;
}

// Category schema
const categorySchema: Schema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
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
