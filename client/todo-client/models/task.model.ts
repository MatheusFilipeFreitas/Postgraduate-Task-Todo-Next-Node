import { TASK_STATUSES } from "./types/task-status.type";

export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
}

export type TaskStatus = (typeof TASK_STATUSES)[number];