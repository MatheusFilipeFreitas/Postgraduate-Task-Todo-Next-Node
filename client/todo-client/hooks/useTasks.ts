"use client";

import { ToastState } from "@/hooks/useToast";
import {
    createTask,
    deleteTask,
    fetchTasks,
    restoreTask,
    updateTaskStatus,
} from "@/lib/tasks.api";
import { Task, TaskStatus } from "@/models/task.model";
import { useCallback, useEffect, useState } from "react";

type UseTasksOptions = {
    autoLoad?: boolean;
    onNotify?: (toast: ToastState) => void;
};

export function useTasks({ autoLoad = true, onNotify }: UseTasksOptions = {}) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(autoLoad);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

    const notify = useCallback((toast: ToastState) => {
        onNotify?.(toast);
    }, [onNotify]);

    const loadTasks = useCallback(async (showRefreshState = false) => {
        setError(null);

        if (showRefreshState) {
            setIsRefreshing(true);
        }

        try {
            const data = await fetchTasks();
            setTasks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load your tasks.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        if (!autoLoad) {
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const data = await fetchTasks();

                if (!cancelled) {
                    setTasks(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Could not load your tasks.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [autoLoad]);

    const addTask = useCallback(async (title: string) => {
        const created = await createTask(title);
        setTasks((current) => [created, ...current]);
        return created;
    }, []);

    const createTaskWithNotify = useCallback(async (title: string) => {
        try {
            const created = await addTask(title);
            notify({ message: "Task created", type: "success" });
            return created;
        } catch (err) {
            notify({
                message: err instanceof Error ? err.message : "Failed to create task.",
                type: "error",
            });
            throw err;
        }
    }, [addTask, notify]);

    const changeStatus = useCallback(async (taskId: string, status: TaskStatus) => {
        const previousTasks = tasks;
        setUpdatingTaskId(taskId);
        setTasks((current) =>
            current.map((task) => (task.id === taskId ? { ...task, status } : task))
        );

        try {
            await updateTaskStatus(taskId, status);
        } catch (err) {
            setTasks(previousTasks);
            notify({
                message: err instanceof Error ? err.message : "Failed to update task.",
                type: "error",
            });
            throw err;
        } finally {
            setUpdatingTaskId(null);
        }
    }, [tasks, notify]);

    const toggleComplete = useCallback((task: Task, completed: boolean) => {
        return changeStatus(task.id, completed ? "completed" : "pending");
    }, [changeStatus]);

    const removeTask = useCallback(async (taskId: string) => {
        const deletedTask = tasks.find((task) => task.id === taskId);

        if (!deletedTask) {
            return;
        }

        setDeletingTaskId(taskId);

        try {
            await deleteTask(taskId);
            setTasks((current) => current.filter((task) => task.id !== taskId));
            notify({
                message: "Task deleted",
                type: "success",
                duration: 5000,
                actionLabel: "Undo",
                onAction: async () => {
                    try {
                        const restored = await restoreTask(deletedTask);
                        setTasks((current) => [restored, ...current]);
                        notify({ message: "Task restored", type: "success" });
                    } catch {
                        notify({ message: "Could not restore task.", type: "error" });
                    }
                },
            });
        } catch (err) {
            notify({
                message: err instanceof Error ? err.message : "Failed to delete task.",
                type: "error",
            });
            throw err;
        } finally {
            setDeletingTaskId(null);
        }
    }, [tasks, notify]);

    return {
        tasks,
        setTasks,
        isLoading,
        isRefreshing,
        error,
        updatingTaskId,
        deletingTaskId,
        loadTasks,
        addTask,
        createTaskWithNotify,
        changeStatus,
        toggleComplete,
        removeTask,
    };
}
