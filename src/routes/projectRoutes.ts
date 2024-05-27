import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { handleInputErrors } from "../middleware/validation";
import { validateProjectExist } from "../middleware/project";
import { taskBelongToProject, taskExist } from "../middleware/task";

const router = Router();

// * Rutas de Proyectos
router
  .route("/")
  .get(ProjectController.getAllProjects)
  .post(
    body("projectName")
      .notEmpty()
      .withMessage("Nombre de Proyecto es Obligatorio"),
    body("clientName")
      .notEmpty()
      .withMessage("Nombre de Cliente es Obligatorio"),
    body("description")
      .notEmpty()
      .withMessage("Descripcion de Proyecto es Obligatoria"),
    handleInputErrors,
    ProjectController.createProject
  );

router
  .route("/:id")
  .get(
    param("id").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    ProjectController.getProjectById
  )
  .put(
    param("id").isMongoId().withMessage("ID no valido"),
    body("projectName")
      .notEmpty()
      .withMessage("Nombre de Proyecto es Obligatorio"),
    body("clientName")
      .notEmpty()
      .withMessage("Nombre de Cliente es Obligatorio"),
    body("description")
      .notEmpty()
      .withMessage("Descripcion de Proyecto es Obligatoria"),
    handleInputErrors,
    ProjectController.updateProjectById
  )
  .delete(
    param("id").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    ProjectController.deleteProjectById
  );

//* Rutas de Tareas
router.param("projectId", validateProjectExist);

router
.route("/:projectId/tasks")
.post(
  body("name").notEmpty().withMessage("Nombre de Tarea es Obligatorio"),
  body("description")
  .notEmpty()
  .withMessage("Descripcion de Tarea es Obligatoria"),
  handleInputErrors,
  TaskController.createTask
)
.get(TaskController.getTasksProject);

router.param("taskId", taskExist);
router.param("taskId", taskBelongToProject);
router
  .route("/:projectId/task/:taskId")
  .get(
    param("taskId").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    TaskController.getTaskById
  )
  .put(
    param("taskId").isMongoId().withMessage("ID no valido"),
    body("name").notEmpty().withMessage("Nombre de Tarea es Obligatorio"),
    body("description")
      .notEmpty()
      .withMessage("Descripcion de Tarea es Obligatoria"),
    handleInputErrors,
    TaskController.updateTaskById
  )
  .delete(
    param("taskId").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    TaskController.deleteTaskById
  );

router.post(
  "/:projectId/task/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no valido"),
  body("status").notEmpty().withMessage("Status field is required"),
  handleInputErrors,
  TaskController.updateStatusTask
);

export default router;
