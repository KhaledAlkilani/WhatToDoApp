import Category, { TaskPopulationFields } from "../models/categoryModel";
import { Request, Response } from "express";
import Task from "../models/taskModel ";

export const TaskCategoryPopulateSelect = {
  CATEGORY: {
    path: TaskPopulationFields.CATEGORY,
    select: `${TaskPopulationFields.CATEGORY_ID} ${TaskPopulationFields.CATEGORY_NAME}`,
  },
} as const;

// export const getCategories = async (req: Request, res: Response) => {
//   try {
//     const categories = await Category.find();
//     res.status(200).json(categories);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching categories", error: err });
//   }

export const getCategories = async (req: Request, res: Response) => {
  try {
    const search: string | undefined = req.query.search as string | undefined;

    // Create base filter object
    const filter: Record<string, any> = {};

    // Add search filter if provided
    if (search && search.trim() !== "") {
      filter.categoryName = { $regex: search.trim(), $options: "i" };
    }

    // Execute query with filter and sort
    const categories = await Category.find(filter)
      .sort({ categoryName: 1 }) // Sort alphabetically
      .lean();

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err });
  }
};
// };
