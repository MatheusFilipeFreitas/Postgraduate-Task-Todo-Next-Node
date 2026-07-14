import { STATUS_ORDER } from "@/lib/task-status";
import { TaskSortMode } from "@/lib/task-preferences";
import { Task } from "@/models/task.model";

export function sortTasks(tasks: Task[], mode: TaskSortMode): Task[] {
    const copy = [...tasks];

    if (mode === "alphabetical") {
        return copy.sort((a, b) => a.title.localeCompare(b.title));
    }

    return copy.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
}
