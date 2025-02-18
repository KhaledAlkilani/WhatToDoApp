import { Router } from "express";
import {
  createTask,
  deleteTask,
  editTask,
  getTasksByDateRange,
  searchTasksByName,
  getTasksWithPagination,
  // getTasks,
} from "../controllers/taskController";

const taskRoute = Router();

taskRoute.post("/tasks", createTask);

taskRoute.put("/tasks/:id", editTask);

taskRoute.delete("/tasks/:id", deleteTask);

taskRoute.get("/tasks/search-tasks-by-name", searchTasksByName);

taskRoute.get("/tasks/date-range", getTasksByDateRange);

taskRoute.get("/tasks/pagination", getTasksWithPagination);

// Leave it for testing
// taskRoute.get("/tasks", getTasks);

export default taskRoute;
