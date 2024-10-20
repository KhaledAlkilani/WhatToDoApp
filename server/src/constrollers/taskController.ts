import { Request, Response } from "express";

const taskList = [
  { id: 1, name: "Task 1" },
  { id: 2, name: "Task 2" },
  { id: 3, name: "Task 3" },
  { id: 4, name: "Task 4" },
];

export const getTasks = async (req: Request, res: Response) => {
  res.json({ tasks: taskList });
};
