import { Uuid } from "./common.types";

export const TASK_STATUSES = ["pending", "in_progress", "completed"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: Uuid;
  userId: Uuid;
  title: string;
  status: TaskStatus;
}

export type TaskResponse = Pick<Task, "id" | "userId" | "title" | "status">;
