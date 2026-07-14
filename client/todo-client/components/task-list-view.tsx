"use client";

import TaskCard from "@/components/task-card";
import { TaskFilterStatus } from "@/lib/task-preferences";
import { Task, TaskStatus } from "@/models/task.model";

export type TaskCardActions = {
    onToggleComplete: (task: Task, completed: boolean) => void;
    onStatusChange: (taskId: string, status: TaskStatus) => void;
    onRequestDelete: (taskId: string) => void;
    onConfirmDelete: (taskId: string) => void;
    onCancelDelete: () => void;
};

type TaskListViewProps = {
    activeTasks: Task[];
    completedTasks: Task[];
    filter: TaskFilterStatus;
    showCompleted: boolean;
    onToggleCompleted: () => void;
    updatingTaskId: string | null;
    deletingTaskId: string | null;
    confirmDeleteId: string | null;
    actions: TaskCardActions;
};

function TaskCardList({
    tasks,
    updatingTaskId,
    deletingTaskId,
    confirmDeleteId,
    actions,
}: {
    tasks: Task[];
    updatingTaskId: string | null;
    deletingTaskId: string | null;
    confirmDeleteId: string | null;
    actions: TaskCardActions;
}) {
    if (tasks.length === 0) {
        return null;
    }

    return (
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    variant="list"
                    isUpdating={updatingTaskId === task.id}
                    isDeleting={deletingTaskId === task.id}
                    isConfirmingDelete={confirmDeleteId === task.id}
                    {...actions}
                />
            ))}
        </ul>
    );
}

export default function TaskListView({
    activeTasks,
    completedTasks,
    filter,
    showCompleted,
    onToggleCompleted,
    updatingTaskId,
    deletingTaskId,
    confirmDeleteId,
    actions,
}: TaskListViewProps) {
    const showCompletedSection = filter === "all" && completedTasks.length > 0;
    const showCompletedOnly = filter === "completed";

    return (
        <div className="space-y-1.5">
            <TaskCardList
                tasks={activeTasks}
                updatingTaskId={updatingTaskId}
                deletingTaskId={deletingTaskId}
                confirmDeleteId={confirmDeleteId}
                actions={actions}
            />

            {showCompletedSection && (
                <div className="card-muted">
                    <button
                        type="button"
                        className="flex w-full items-center justify-between gap-3 text-left"
                        onClick={onToggleCompleted}
                    >
                        <span className="font-medium">
                            Completed tasks ({completedTasks.length})
                        </span>
                        <span className="text-sm text-muted">
                            {showCompleted ? "Hide" : "Show"}
                        </span>
                    </button>

                    {showCompleted && (
                        <div className="mt-3">
                            <TaskCardList
                                tasks={completedTasks}
                                updatingTaskId={updatingTaskId}
                                deletingTaskId={deletingTaskId}
                                confirmDeleteId={confirmDeleteId}
                                actions={actions}
                            />
                        </div>
                    )}
                </div>
            )}

            {showCompletedOnly && (
                <TaskCardList
                    tasks={completedTasks}
                    updatingTaskId={updatingTaskId}
                    deletingTaskId={deletingTaskId}
                    confirmDeleteId={confirmDeleteId}
                    actions={actions}
                />
            )}
        </div>
    );
}
