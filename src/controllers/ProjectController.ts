import { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {

  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    console.log(project);
    try {
      await project.save();
      res.status(201).json({ msg: "Project Created", project });
    } catch (error) {
      console.log(error);
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      if (!projects) return res.status(400).json({ msg: "Not Found" });
      res.status(200).json(projects);
    } catch (error) {
      console.log(error);
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate('tasks');
      if (!project) return res.status(400).json({ msg: "Project Not Found" });
      res.status(200).json(project);
    } catch (error) {
      console.log(error);
    }
  };

  static updateProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      // * 1ra Forma
      // * buscamos y actualizamos de acuerdo a sus campos
      const project = await Project.findById(id);
      if (!project) return res.status(400).json({ msg: "Project Not Found" });
      const {projectName  , clientName , description} =  req.body
      project.projectName=projectName;
      project.clientName= clientName;
      project.description=description;
      const projectUpdate = await project.save()
      res.status(202).json({msg:'Update Project', projectUpdate})

      // * 2da forma actualizacion directa con mongoose
      // const project = await Project.findByIdAndUpdate(id , req.body)
      // if (!project) return res.status(400).json({ msg: "Project Not Found" });
      // await project.save()
      // res.send('Update Project')
    } catch (error) {
      console.log(error);
    }

  }

  static deleteProjectById = async (req: Request, res: Response) => {
    const {id} = req.params
    try {
      const project = await Project.findById(id , req.body)
      if (!project) return res.status(400).json({ msg: "Project Not Found" });

      await Project.findByIdAndDelete(id)
      res.send('Delete Project')
    } catch (error) {
      console.log(error)
    }
  }
}
