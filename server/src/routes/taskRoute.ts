import { Router } from "express";
import { createTask, getTasks } from "../constrollers/taskController";

const taskRoute = Router();

taskRoute.get("/tasks", getTasks);

taskRoute.post("/tasks", createTask);

export default taskRoute;
