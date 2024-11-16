import { Request, Response } from "express";

export const sayHello = async (req: Request, res: Response) => {
  res.send("Hello express!");
};
