import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
} from "../constrollers/taskController";

const taskRoute = Router();

taskRoute.get("/tasks", getTasks);

taskRoute.post("/tasks", createTask);

taskRoute.delete("/tasks/:id", deleteTask);

export default taskRoute;
