import { Router } from "express";
import { getTasks } from "../constrollers/taskController";

const taskRoute = Router();

taskRoute.get("/tasks", getTasks);

export default taskRoute;
