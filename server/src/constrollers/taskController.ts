import { Request, Response } from "express";

export const getTasks = async (req: Request, res: Response) => {
  res.json({ message: "Task api route works!" });
};
