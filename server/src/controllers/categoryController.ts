import Category, { TaskPopulationFields } from "../models/categoryModel";
import { Request, Response } from "express";
import Task from "../models/taskModel ";

export const TaskCategoryPopulateSelect = {
  CATEGORY: {
    path: TaskPopulationFields.CATEGORY,
    select: `${TaskPopulationFields.CATEGORY_ID} ${TaskPopulationFields.CATEGORY_NAME}`,
  },
} as const;

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err });
  }
};

export const searchTasksByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryName } = req.query;

    if (!categoryName || typeof categoryName !== "string") {
      res.status(400).json({
        error: "Category name query parameter is required and must be a string",
      });
      return;
    }

    // Find category by name
    const category = await Category.findOne({
      categoryName: { $regex: new RegExp(categoryName, "i") }, // Case-insensitive search
    });

    if (!category) {
      res.status(404).json({
        error: `Category with name "${categoryName}" not found`,
      });
      return;
    }

    // Find tasks that belong to the found category
    const tasks = await Task.find({ category: category._id }).populate(
      TaskCategoryPopulateSelect.CATEGORY
    );

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in searchTasksByCategory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
