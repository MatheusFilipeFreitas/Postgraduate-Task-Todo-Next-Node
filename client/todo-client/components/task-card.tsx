"use client";

import TaskCheckbox from "@/components/task-checkbox";
import TaskDeleteConfirm from "@/components/task-delete-confirm";
import { nextStatus, STATUS_BADGE_CLASS, STATUS_LABELS } from "@/lib/task-status";
import { Task, TaskStatus } from "@/models/task.model";

type TaskCardProps = {
    task: Task;
    isUpdating: boolean;
    isDeleting: boolean;
    isConfirmingDelete: boolean;
    onToggleComplete: (task: Task, completed: boolean) => void;
    onStatusChange: (taskId: string, status: TaskStatus) => void;
    onRequestDelete: (taskId: string) => void;
    onConfirmDelete: (taskId: string) => void;
    onCancelDelete: () => void;
    variant?: "list" | "kanban";
    isDragging?: boolean;
    onDragStart?: (taskId: string) => void;
    onDragEnd?: () => void;
};

export default function TaskCard({
    task,
    isUpdating,
    isDeleting,
    isConfirmingDelete,
    onToggleComplete,
    onStatusChange,
    onRequestDelete,
    onConfirmDelete,
    onCancelDelete,
    variant = "list",
    isDragging = false,
    onDragStart,
    onDragEnd,
}: TaskCardProps) {
    const isCompleted = task.status === "completed";
    const isKanban = variant === "kanban";
    const isBusy = isUpdating || isDeleting;

    const handleDragStart = (event: React.DragEvent<HTMLButtonElement>) => {
        if (isBusy) {
            event.preventDefault();
            return;
        }

        event.dataTransfer.setData("text/task-id", task.id);
        event.dataTransfer.effectAllowed = "move";
        onDragStart?.(task.id);
    };

    const deleteAction = isConfirmingDelete ? (
        <TaskDeleteConfirm
            isDeleting={isDeleting}
            onConfirm={() => onConfirmDelete(task.id)}
            onCancel={onCancelDelete}
        />
    ) : (
        <button
            type="button"
            className="task-card-delete"
            onClick={() => onRequestDelete(task.id)}
            disabled={isBusy}
            aria-label={`Delete ${task.title}`}
        >
            ✕
        </button>
    );

    return (
        <li
            className={`task-card list-fade-in ${isKanban ? "task-card-kanban" : "task-card-list"} ${
                isBusy ? "opacity-60" : ""
            } ${isDragging ? "task-card-dragging" : ""}`}
        >
            <div className="task-card-row">
                {isKanban && (
                    <button
                        type="button"
                        draggable={!isBusy}
                        onDragStart={handleDragStart}
                        onDragEnd={() => onDragEnd?.()}
                        className="kanban-drag-handle"
                        aria-label={`Drag ${task.title} to another column`}
                        disabled={isBusy}
                    >
                        ⠿
                    </button>
                )}

                <TaskCheckbox
                    checked={isCompleted}
                    onChange={(checked) => onToggleComplete(task, checked)}
                    disabled={isBusy}
                    label={task.title}
                />

                <h2 className={`task-card-title ${isCompleted ? "task-title-completed" : ""}`}>
                    {task.title}
                </h2>

                <div className="task-card-actions">
                    {!isKanban && !isCompleted && (
                        <button
                            type="button"
                            className={`task-status-pill ${STATUS_BADGE_CLASS[task.status]}`}
                            onClick={() => onStatusChange(task.id, nextStatus(task.status))}
                            disabled={isBusy}
                            aria-label={`Status: ${STATUS_LABELS[task.status]}. Click to change.`}
                            title={`Status: ${STATUS_LABELS[task.status]}`}
                        >
                            {STATUS_LABELS[task.status]}
                        </button>
                    )}

                    {isKanban && (
                        <button
                            type="button"
                            className="kanban-advance-btn"
                            onClick={() => onStatusChange(task.id, nextStatus(task.status))}
                            disabled={isBusy}
                            aria-label="Move to next column"
                            title="Move to next column"
                        >
                            →
                        </button>
                    )}

                    {deleteAction}
                </div>
            </div>
        </li>
    );
}
