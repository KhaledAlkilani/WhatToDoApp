import { Request, Response } from "express";
import Task from "../models/taskModel ";

export const getTasks = async (req: Request, res: Response) => {
  try {
    // Get the tasks from the model
    const tasks = await Task.find();
    console.log(tasks);
    res.status(200).json(tasks);
  } catch (err: any) {
    // If get tasks from db failed
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
