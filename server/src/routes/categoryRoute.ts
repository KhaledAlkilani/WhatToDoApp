import { Router } from "express";
import { getCategories } from "../controllers/categoryController";

const categoryRoute = Router();

categoryRoute.get("/categories", getCategories);

export default categoryRoute;
