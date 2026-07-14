import { TaskFilterStatus } from "@/lib/task-preferences";
import { ReadonlyURLSearchParams } from "next/navigation";

export function isTaskFilter(value: string | null): value is TaskFilterStatus {
    return value === "all"
        || value === "pending"
        || value === "in_progress"
        || value === "completed";
}

export function getFilterFromSearchParams(
    searchParams: ReadonlyURLSearchParams,
): TaskFilterStatus | null {
    const value = searchParams.get("filter");
    return isTaskFilter(value) ? value : null;
}
