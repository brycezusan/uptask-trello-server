import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export const taskExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: "Task Not Found" });
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const taskBelongToProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.project.id.toString() !== req.task.project.toString())
    return res.status(403).json({ msg: "Action Not Valid" });
  next()
};
