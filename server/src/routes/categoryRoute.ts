import { Router } from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/categoryController";

const categoryRoute = Router();

categoryRoute.get("/categories", getCategories);

categoryRoute.post("/new-category", createCategory);

export default categoryRoute;
