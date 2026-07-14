"use client";

import TaskCard from "@/components/task-card";
import { KANBAN_COLUMNS } from "@/lib/task-status";
import { Task, TaskStatus } from "@/models/task.model";
import { useState } from "react";

type KanbanBoardProps = {
    tasks: Task[];
    updatingTaskId: string | null;
    deletingTaskId: string | null;
    confirmDeleteId: string | null;
    onToggleComplete: (task: Task, completed: boolean) => void;
    onStatusChange: (taskId: string, status: TaskStatus) => void;
    onRequestDelete: (taskId: string) => void;
    onConfirmDelete: (taskId: string) => void;
    onCancelDelete: () => void;
};

type ColumnDef = (typeof KANBAN_COLUMNS)[number];

type ColumnProps = {
    column: ColumnDef;
    columnTasks: Task[];
    isDropTarget: boolean;
    isDragging: boolean;
    emptyHint: string;
    updatingTaskId: string | null;
    deletingTaskId: string | null;
    confirmDeleteId: string | null;
    draggedTaskId: string | null;
    onDragOver: (event: React.DragEvent<HTMLElement>, status: TaskStatus) => void;
    onDragLeave: (event: React.DragEvent<HTMLElement>, status: TaskStatus) => void;
    onDrop: (event: React.DragEvent<HTMLElement>, status: TaskStatus) => void;
    onDragStart: (taskId: string) => void;
    onDragEnd: () => void;
    onToggleComplete: (task: Task, completed: boolean) => void;
    onStatusChange: (taskId: string, status: TaskStatus) => void;
    onRequestDelete: (taskId: string) => void;
    onConfirmDelete: (taskId: string) => void;
    onCancelDelete: () => void;
};

function KanbanColumn({
    column,
    columnTasks,
    isDropTarget,
    isDragging,
    emptyHint,
    updatingTaskId,
    deletingTaskId,
    confirmDeleteId,
    draggedTaskId,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragStart,
    onDragEnd,
    onToggleComplete,
    onStatusChange,
    onRequestDelete,
    onConfirmDelete,
    onCancelDelete,
}: ColumnProps) {
    return (
        <section
            className={`kanban-column ${column.accent} ${isDropTarget ? "kanban-column-drop-active" : ""}`}
            onDragOver={(event) => onDragOver(event, column.status)}
            onDragLeave={(event) => onDragLeave(event, column.status)}
            onDrop={(event) => onDrop(event, column.status)}
        >
            <header className="kanban-column-header">
                <div>
                    <h2 className="text-sm font-semibold">{column.title}</h2>
                    <p className="text-xs text-muted">{column.hint}</p>
                </div>
                <span className="kanban-count">{columnTasks.length}</span>
            </header>

            {columnTasks.length === 0 ? (
                <div className={`kanban-empty ${isDragging ? "kanban-empty-drop" : ""}`}>
                    {isDragging ? "Drop here" : emptyHint}
                </div>
            ) : (
                <ul className="m-0 flex list-none flex-col gap-1 p-0">
                    {columnTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            variant="kanban"
                            isUpdating={updatingTaskId === task.id}
                            isDeleting={deletingTaskId === task.id}
                            isConfirmingDelete={confirmDeleteId === task.id}
                            isDragging={draggedTaskId === task.id}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            onToggleComplete={onToggleComplete}
                            onStatusChange={onStatusChange}
                            onRequestDelete={onRequestDelete}
                            onConfirmDelete={onConfirmDelete}
                            onCancelDelete={onCancelDelete}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
}

export default function KanbanBoard({
    tasks,
    updatingTaskId,
    deletingTaskId,
    confirmDeleteId,
    onToggleComplete,
    onStatusChange,
    onRequestDelete,
    onConfirmDelete,
    onCancelDelete,
}: KanbanBoardProps) {
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);
    const [activeColumn, setActiveColumn] = useState<TaskStatus>("pending");

    const draggedTask = draggedTaskId ? tasks.find((task) => task.id === draggedTaskId) : null;
    const isDragging = draggedTaskId !== null;
    const activeColumnDef = KANBAN_COLUMNS.find((column) => column.status === activeColumn) ?? KANBAN_COLUMNS[0];

    const handleDragStart = (taskId: string) => {
        setDraggedTaskId(taskId);
    };

    const handleDragEnd = () => {
        setDraggedTaskId(null);
        setDropTarget(null);
    };

    const handleDragOver = (event: React.DragEvent<HTMLElement>, status: TaskStatus) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";

        if (draggedTask?.status !== status) {
            setDropTarget(status);
        }
    };

    const handleDragLeave = (event: React.DragEvent<HTMLElement>, status: TaskStatus) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setDropTarget((current) => (current === status ? null : current));
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLElement>, status: TaskStatus) => {
        event.preventDefault();

        const taskId = event.dataTransfer.getData("text/task-id") || draggedTaskId;

        if (!taskId) {
            handleDragEnd();
            return;
        }

        const task = tasks.find((item) => item.id === taskId);

        if (task && task.status !== status) {
            onStatusChange(taskId, status);
        }

        handleDragEnd();
    };

    const handleMobileStatusChange = (taskId: string, status: TaskStatus) => {
        onStatusChange(taskId, status);
        setActiveColumn(status);
    };

    const columnProps = {
        isDragging,
        updatingTaskId,
        deletingTaskId,
        confirmDeleteId,
        draggedTaskId,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        onToggleComplete,
        onRequestDelete,
        onConfirmDelete,
        onCancelDelete,
    };

    return (
        <div>
            <div className="md:hidden">
                <div className="kanban-tabs" role="tablist" aria-label="Board columns">
                    {KANBAN_COLUMNS.map((column) => {
                        const count = tasks.filter((task) => task.status === column.status).length;
                        const isActive = activeColumn === column.status;
                        const tabTone =
                            column.status === "pending"
                                ? "kanban-tab-pending"
                                : column.status === "in_progress"
                                    ? "kanban-tab-doing"
                                    : "kanban-tab-done";

                        return (
                            <button
                                key={column.status}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                className={`kanban-tab ${tabTone} ${isActive ? "kanban-tab-active" : ""}`}
                                onClick={() => setActiveColumn(column.status)}
                            >
                                <span className="leading-none">{column.title}</span>
                                <span className="kanban-tab-count">{count}</span>
                            </button>
                        );
                    })}
                </div>

                <KanbanColumn
                    column={activeColumnDef}
                    columnTasks={tasks.filter((task) => task.status === activeColumn)}
                    isDropTarget={false}
                    emptyHint="No tasks here — use → to move"
                    onStatusChange={handleMobileStatusChange}
                    {...columnProps}
                />
            </div>

            <div className="kanban-scroll hidden md:block">
                <div className="kanban-grid">
                    {KANBAN_COLUMNS.map((column) => {
                        const columnTasks = tasks.filter((task) => task.status === column.status);
                        const isDropTarget = dropTarget === column.status && draggedTask?.status !== column.status;

                        return (
                            <KanbanColumn
                                key={column.status}
                                column={column}
                                columnTasks={columnTasks}
                                isDropTarget={isDropTarget}
                                emptyHint="Drag tasks here"
                                onStatusChange={onStatusChange}
                                {...columnProps}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
