export type TaskViewMode = "list" | "board";
export type TaskSortMode = "active-first" | "alphabetical";
export type TaskFilterStatus = "all" | "pending" | "in_progress" | "completed";

export type TaskPreferences = {
    viewMode: TaskViewMode;
    sortMode: TaskSortMode;
    filter: TaskFilterStatus;
    showCompleted: boolean;
};

const STORAGE_KEY = "taskflow-preferences";

const defaultPreferences: TaskPreferences = {
    viewMode: "list",
    sortMode: "active-first",
    filter: "all",
    showCompleted: false,
};

export function getTaskPreferences(): TaskPreferences {
    if (typeof window === "undefined") {
        return defaultPreferences;
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return defaultPreferences;
        }

        return { ...defaultPreferences, ...JSON.parse(stored) as Partial<TaskPreferences> };
    } catch {
        return defaultPreferences;
    }
}

export function saveTaskPreferences(preferences: Partial<TaskPreferences>) {
    if (typeof window === "undefined") {
        return;
    }

    const next = { ...getTaskPreferences(), ...preferences };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
