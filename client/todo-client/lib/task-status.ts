import { TaskStatus } from "@/models/task.model";

export const STATUS_LABELS: Record<TaskStatus, string> = {
    pending: "Todo",
    in_progress: "Doing",
    completed: "Done",
};

export const STATUS_BADGE_CLASS: Record<TaskStatus, string> = {
    pending: "badge-pending",
    in_progress: "badge-in-progress",
    completed: "badge-completed",
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
    pending: "text-amber-600",
    in_progress: "text-sky-600",
    completed: "text-emerald-600",
};

export const STATUS_ORDER: Record<TaskStatus, number> = {
    pending: 0,
    in_progress: 1,
    completed: 2,
};

export const KANBAN_COLUMNS = [
    { status: "pending" as const, title: "Todo", hint: "Not started", accent: "kanban-col-pending" },
    { status: "in_progress" as const, title: "Doing", hint: "In progress", accent: "kanban-col-doing" },
    { status: "completed" as const, title: "Done", hint: "Completed", accent: "kanban-col-done" },
];

export const STATUS_TOGGLE_OPTIONS: { value: TaskStatus; label: string; shortLabel: string }[] = [
    { value: "pending", label: "Pending", shortLabel: "Todo" },
    { value: "in_progress", label: "In Progress", shortLabel: "Doing" },
    { value: "completed", label: "Completed", shortLabel: "Done" },
];

export const HOME_STAT_LINKS = [
    { key: "all", label: "Total", filter: null, color: "" },
    { key: "pending", label: "Todo", filter: "pending", color: STATUS_COLORS.pending },
    { key: "in_progress", label: "Doing", filter: "in_progress", color: STATUS_COLORS.in_progress },
    { key: "completed", label: "Done", filter: "completed", color: STATUS_COLORS.completed },
] as const;

export function nextStatus(status: TaskStatus): TaskStatus {
    const cycle: Record<TaskStatus, TaskStatus> = {
        pending: "in_progress",
        in_progress: "completed",
        completed: "pending",
    };

    return cycle[status];
}
