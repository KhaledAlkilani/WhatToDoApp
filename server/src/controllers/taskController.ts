import { Request, RequestHandler, Response } from "express";
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
      .json({ message: "Failed to create task", error: err.message });
  }
};

export const editTask = async (req: Request, res: Response) => {
  try {
    const { name, content, startDate, endDate } = req.body;
    const taskId = req.params.id;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { name, content, startDate, endDate },
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "failed to edit task", error: err.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    const taskToDelete = await Task.findByIdAndDelete(taskId);

    if (!taskToDelete) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to delete task", error: error.message });
  }
};

// Search tasks by name
export const searchTasksByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      res.status(400).json({
        error: "Name query parameter is required and must be a string",
      });
      return;
    }

    // Find tasks matching the name (case-insensitive)
    const tasks = await Task.find({
      name: { $regex: new RegExp(name, "i") }, // Case-insensitive search using regex
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getSearchByName:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Filter tasks by date range
export const getTasksByDateRange = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400).json({ error: "Start date and end date are required" });
    return;
  }

  try {
    const tasks = await Task.find({
      startDate: { $gte: new Date(startDate as string) },
      endDate: { $lte: new Date(endDate as string) },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by date range:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Pagination function
export const getTasksWithPagination = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const tasks = await Task.find().skip(skip).limit(limit);
    const totalCount = await Task.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      tasks,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (err) {
    console.error("Error fetching tasks with pagination:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
