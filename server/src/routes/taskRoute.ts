import { Router } from "express";
import {
  createTask,
  deleteTask,
  editTask,
  getTasksByDateRange,
  getTasks,
  searchTasksByName,
  getTasksWithPagination,
  getCategories,
  createCategory,
} from "../controllers/taskController";

const taskRoute = Router();

taskRoute.get("/tasks", getTasks);

taskRoute.post("/tasks", createTask);

taskRoute.put("/tasks/:id", editTask);

taskRoute.delete("/tasks/:id", deleteTask);

taskRoute.get("/tasks/search-tasks-by-name", searchTasksByName);

taskRoute.get("/tasks/date-range", getTasksByDateRange);

taskRoute.get("/tasks/pagination", getTasksWithPagination);

taskRoute.get("/categories", getCategories);

taskRoute.post("/categories", createCategory);

export default taskRoute;
