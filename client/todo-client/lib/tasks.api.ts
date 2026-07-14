import { Task, TaskStatus } from "@/models/task.model";

const JSON_HEADERS = { "Content-Type": "application/json" };

async function parseResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = typeof data === "object" && data && "error" in data && typeof data.error === "string"
            ? data.error
            : `Request failed (${response.status})`;
        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        credentials: "include",
        ...init,
    });

    return parseResponse<T>(response);
}

export async function fetchTasks(): Promise<Task[]> {
    const data = await request<Task[]>("/api/tasks");
    return Array.isArray(data) ? data : [];
}

export async function createTask(title: string): Promise<Task> {
    return request<Task>("/api/tasks", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ title }),
    });
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    return request<Task>(`/api/tasks?id=${taskId}`, {
        method: "PATCH",
        headers: JSON_HEADERS,
        body: JSON.stringify({ status }),
    });
}

export async function deleteTask(taskId: string): Promise<void> {
    await request<void>(`/api/tasks?id=${taskId}`, { method: "DELETE" });
}

export async function restoreTask(task: Pick<Task, "title" | "status">): Promise<Task> {
    const restored = await createTask(task.title);

    if (task.status === "pending") {
        return restored;
    }

    return updateTaskStatus(restored.id, task.status);
}
