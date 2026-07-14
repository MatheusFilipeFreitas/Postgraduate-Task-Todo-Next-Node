import { Task, TaskResponse } from "../types/task.types";
import { User, UserResponse } from "../types/user.types";

export function toUserResponse(user: User): UserResponse {
  return { id: user.id, username: user.username, email: user.email };
}

export function toTaskResponse(task: Task): TaskResponse {
  return {
    id: task.id,
    userId: task.userId,
    title: task.title,
    status: task.status,
  };
}
