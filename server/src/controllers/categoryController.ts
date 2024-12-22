import Category from "../models/categoryModel";
import { Request, Response } from "express";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err });
  }
};

// Create or fetch an existing category (no return value, void function)
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { categoryName } = req.body;

  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({ categoryName });

    if (existingCategory) {
      res.status(400).json({ message: "Category already exists" });
    }

    // If the category does not exist, create it
    const newCategory = new Category({ categoryName });
    await newCategory.save(); // Save the new category to the database

    // Respond with the newly created category
    res.status(201).json(newCategory);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Failed to create category", error: err });
  }
};
