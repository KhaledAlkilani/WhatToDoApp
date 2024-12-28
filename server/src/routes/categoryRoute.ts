import { Router } from "express";
import {
  getCategories,
  searchTasksByCategory,
} from "../controllers/categoryController";

const categoryRoute = Router();

categoryRoute.get("/categories", getCategories);

categoryRoute.get("/categories/search-by-category", searchTasksByCategory);

export default categoryRoute;
