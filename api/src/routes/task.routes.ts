import { RequestHandler, Router } from "express";
import { TaskService } from "../services/task.service";
import { asyncHandler } from "../utils/async-handler";
import { toTaskResponse } from "../utils/mappers";
import { parseTaskId, requireFields, validateStatus, validateTitle } from "../utils/validators";

export function createTaskRouter(
  taskService: TaskService,
  authenticate: RequestHandler
): Router {
  const router = Router();

  router.use(authenticate);

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const tasks = await taskService.listByUser(req.user.id);
      res.status(200).json(tasks.map(toTaskResponse));
    })
  );

  router.get(
    "/:taskId",
    asyncHandler(async (req, res) => {
      const taskId = parseTaskId(req.params.taskId);
      const task = await taskService.getById(taskId, req.user.id);
      res.status(200).json(toTaskResponse(task));
    })
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      requireFields(req.body, ["title"]);

      const title = validateTitle(req.body.title);
      const task = await taskService.create(title, req.user.id);
      res.status(201).json(toTaskResponse(task));
    })
  );

  router.patch(
    "/:taskId",
    asyncHandler(async (req, res) => {
      const taskId = parseTaskId(req.params.taskId);
      requireFields(req.body, ["status"]);

      const status = validateStatus(req.body.status);
      const task = await taskService.updateStatus(taskId, req.user.id, status);
      res.status(200).json(toTaskResponse(task));
    })
  );

  router.delete(
    "/:taskId",
    asyncHandler(async (req, res) => {
      const taskId = parseTaskId(req.params.taskId);
      await taskService.delete(taskId, req.user.id);
      res.status(204).send();
    })
  );

  return router;
}
