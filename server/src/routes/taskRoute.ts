import { Router } from "express";
import {
  createTask,
  deleteTask,
  editTask,
  getTasksByDateRange,
  getTasks,
  searchTasksByName,
} from "../controllers/taskController";

const taskRoute = Router();

taskRoute.get("/tasks", getTasks);

taskRoute.post("/tasks", createTask);

taskRoute.put("/tasks/:id", editTask);

taskRoute.delete("/tasks/:id", deleteTask);

taskRoute.get("/tasks/search-tasks-by-name", searchTasksByName);

taskRoute.get("/tasks/date-range", getTasksByDateRange);

export default taskRoute;
