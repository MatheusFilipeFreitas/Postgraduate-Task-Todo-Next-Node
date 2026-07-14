import { Task } from "@/models/task.model";

export type TaskStats = {
    all: number;
    pending: number;
    in_progress: number;
    completed: number;
};

export function computeTaskStats(tasks: Task[]): TaskStats {
    return {
        all: tasks.length,
        pending: tasks.filter((task) => task.status === "pending").length,
        in_progress: tasks.filter((task) => task.status === "in_progress").length,
        completed: tasks.filter((task) => task.status === "completed").length,
    };
}
