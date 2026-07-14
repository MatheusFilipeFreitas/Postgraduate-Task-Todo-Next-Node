import { TaskRepository } from "../repositories/task.repository";
import { Uuid } from "../types/common.types";
import { Task, TaskStatus } from "../types/task.types";
import { HttpError } from "../utils/http-error";

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async listByUser(userId: Uuid): Promise<Task[]> {
    return this.taskRepository.findAllByUserId(userId);
  }

  async getById(taskId: Uuid, userId: Uuid): Promise<Task> {
    const task = await this.taskRepository.findByIdAndUserId(taskId, userId);

    if (!task) {
      throw new HttpError(404, "Task not found");
    }

    return task;
  }

  async create(title: string, userId: Uuid): Promise<Task> {
    return this.taskRepository.create({
      userId,
      title,
      status: "pending",
    });
  }

  async updateStatus(taskId: Uuid, userId: Uuid, status: TaskStatus): Promise<Task> {
    return this.taskRepository.updateStatus(taskId, userId, status);
  }

  async delete(taskId: Uuid, userId: Uuid): Promise<void> {
    await this.taskRepository.delete(taskId, userId);
  }
}
