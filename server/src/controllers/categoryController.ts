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
