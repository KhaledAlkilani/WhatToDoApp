import { Router } from "express";
import {
  createTask,
  deleteTask,
  editTask,
  getTasks,
} from "../controllers/taskController";

const taskRoute = Router();

taskRoute.get("/tasks", getTasks);

taskRoute.post("/tasks", createTask);

taskRoute.put("/tasks/:id", editTask);

taskRoute.delete("/tasks/:id", deleteTask);

export default taskRoute;
