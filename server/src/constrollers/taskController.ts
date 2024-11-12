import { Request, Response } from "express";
import Task from "../models/taskModel ";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Couldn't get tasks from the db", error: err.message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { name, content, startDate, endDate } = req.body;
    const newTask = new Task({
      name,
      content,
      startDate,
      endDate,
    });
    await newTask.save();
    res.status(200).json(newTask);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Error to create task", error: err.message });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskId = req.params.id;

    const taskToDelete = await Task.findByIdAndDelete(taskId);

    if (!taskToDelete) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to delete task", error: err.message });
  }
};
