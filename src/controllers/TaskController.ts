import { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {

  static createTask = async (req: Request, res: Response) => {
    const { project } = req;
    try {
      const task = new Task(req.body);
      task.project = project.id;
      project.tasks.push(task.id);
      await Promise.allSettled([task.save(), project.save()]);
      res.status(200).send('created task');
    } catch (error) {
      console.log(error);
    }
  };

  static getTasksProject = async (req: Request, res: Response) => {
    const { project } = req;
    try {
      const tasksProject = await Task.find({
        project: project.id,
      }).populate("project");
      res.status(200).json({ tasks: tasksProject });
    } catch (error) {
      console.log(error);
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    const {task} = req;
    try {
      res.status(200).json({
        id: task.id,
        name: task.name,
        description: task.description,
        status: task.status,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static updateTaskById = async (req: Request, res: Response) => {
    const {task} = req;
    try {
      await Task.findByIdAndUpdate(task.id ,req.body)
      res.status(202).send("Succesfully Update Task ");
    } catch (error) {
      res.status(505).json({ error: "Hubo un error" });
    }
  };

  static deleteTaskById = async (req: Request, res: Response) => {
    const { project , task } = req;
    try {
      project.tasks = project.tasks.filter( task=> task.toString() !== task.id.toString())
      await Promise.allSettled([task.deleteOne() , project.save() ])
      res.send('Delete Task')
    } catch (error) {
      res.status(505).json({ error: "Hubo un error" });
      console.log(error);
    }
  };

  static updateStatusTask = async (req:Request , res:Response)=>{
    const {task} =  req
    try {
      const { status } =  req.body
      task.status = status
      await task.save()
      res.send('update status task')
    } catch (error) {
      console.log(error)
    }
  }
}
