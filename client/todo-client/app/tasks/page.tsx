"use client";

import KanbanBoard from "@/components/kanban-board";
import PageShell from "@/components/page-shell";
import ProgressBar from "@/components/progress-bar";
import QuickAddForm from "@/components/quick-add-form";
import TaskListView from "@/components/task-list-view";
import Toast from "@/components/toast";
import ViewToggle from "@/components/view-toggle";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/useToast";
import { sortTasks } from "@/lib/sort-tasks";
import { computeTaskStats } from "@/lib/task-stats";
import { STATUS_LABELS } from "@/lib/task-status";
import { getFilterFromSearchParams } from "@/lib/task-filters";
import {
    getTaskPreferences,
    saveTaskPreferences,
    TaskFilterStatus,
    TaskSortMode,
    TaskViewMode,
} from "@/lib/task-preferences";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

function TasksPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const quickInputRef = useRef<HTMLInputElement>(null);
    const { toast, showToast, dismissToast } = useToast();

    const {
        tasks,
        isLoading,
        isRefreshing,
        error,
        updatingTaskId,
        deletingTaskId,
        loadTasks,
        createTaskWithNotify,
        changeStatus,
        toggleComplete,
        removeTask,
    } = useTasks({ onNotify: showToast });

    const initialPrefs = getTaskPreferences();

    const [fallbackFilter, setFallbackFilter] = useState<TaskFilterStatus>(initialPrefs.filter);
    const [sortMode, setSortMode] = useState<TaskSortMode>(initialPrefs.sortMode);
    const [viewMode, setViewMode] = useState<TaskViewMode>(initialPrefs.viewMode);
    const [showCompleted, setShowCompleted] = useState(initialPrefs.showCompleted);
    const [quickTitle, setQuickTitle] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const filter = getFilterFromSearchParams(searchParams) ?? fallbackFilter;

    useEffect(() => {
        saveTaskPreferences({ sortMode, viewMode, showCompleted });
    }, [sortMode, viewMode, showCompleted]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                quickInputRef.current?.focus();
            }

            if (event.key === "Escape") {
                setConfirmDeleteId(null);
                if (search) setSearch("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [search]);

    const stats = useMemo(() => computeTaskStats(tasks), [tasks]);

    const filteredTasks = useMemo(() => {
        const query = search.trim().toLowerCase();

        const matched = tasks.filter((task) => {
            const matchesFilter = filter === "all" || task.status === filter;
            const matchesSearch = !query || task.title.toLowerCase().includes(query);
            return matchesFilter && matchesSearch;
        });

        return sortTasks(matched, sortMode);
    }, [tasks, search, filter, sortMode]);

    const activeTasks = useMemo(
        () => filteredTasks.filter((task) => task.status !== "completed"),
        [filteredTasks]
    );

    const completedTasks = useMemo(
        () => filteredTasks.filter((task) => task.status === "completed"),
        [filteredTasks]
    );

    const hasActiveFilters = search.trim().length > 0 || filter !== "all";

    const updateFilter = (nextFilter: TaskFilterStatus) => {
        setFallbackFilter(nextFilter);
        saveTaskPreferences({ filter: nextFilter });

        const params = new URLSearchParams(searchParams.toString());

        if (nextFilter === "all") {
            params.delete("filter");
        } else {
            params.set("filter", nextFilter);
        }

        const query = params.toString();
        router.replace(query ? `/tasks?${query}` : "/tasks", { scroll: false });
    };

    const handleQuickCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const title = quickTitle.trim();

        if (!title) return;

        setIsCreating(true);

        try {
            await createTaskWithNotify(title);
            setQuickTitle("");
            quickInputRef.current?.focus();
        } catch {
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (taskId: string) => {
        try {
            await removeTask(taskId);
            setConfirmDeleteId(null);
        } catch {
        }
    };

    const clearFilters = () => {
        setSearch("");
        updateFilter("all");
    };

    const filters: { key: TaskFilterStatus; label: string; count: number }[] = [
        { key: "all", label: "All", count: stats.all },
        { key: "pending", label: STATUS_LABELS.pending, count: stats.pending },
        { key: "in_progress", label: STATUS_LABELS.in_progress, count: stats.in_progress },
        { key: "completed", label: STATUS_LABELS.completed, count: stats.completed },
    ];

    const taskActions = {
        onToggleComplete: toggleComplete,
        onStatusChange: changeStatus,
        onRequestDelete: setConfirmDeleteId,
        onConfirmDelete: handleDelete,
        onCancelDelete: () => setConfirmDeleteId(null),
    };

    return (
        <PageShell>
            <div className="page-header">
                <div>
                    <p className="text-xs font-medium text-primary">Task board</p>
                    <h1 className="mt-0.5 text-2xl font-semibold tracking-tight">Your tasks</h1>
                    {!isLoading && tasks.length > 0 && (
                        <div className="mt-2 max-w-sm">
                            <ProgressBar
                                value={stats.completed}
                                max={stats.all}
                                label={`${stats.completed} of ${stats.all} done`}
                            />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <ViewToggle
                        value={viewMode}
                        options={[
                            { value: "list", label: "List" },
                            { value: "board", label: "Board" },
                        ]}
                        onChange={setViewMode}
                    />
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => loadTasks(true)}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
            </div>

            <QuickAddForm
                value={quickTitle}
                onChange={setQuickTitle}
                onSubmit={handleQuickCreate}
                isSubmitting={isCreating}
                placeholder="Quick add — press ⌘K"
                inputId="quick-title"
                inputRef={quickInputRef}
                className="toolbar mb-3 flex flex-col gap-2 sm:flex-row sm:items-center"
                submitLabel="Add"
                submittingLabel="Adding..."
            />

            <div className="toolbar mb-4">
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                        id="search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search tasks..."
                        className="input sm:max-w-xs"
                        aria-label="Search tasks"
                    />
                    <div className="flex flex-wrap gap-1.5">
                        {filters.map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => updateFilter(item.key)}
                                className={`filter-chip ${filter === item.key ? "filter-chip-active" : ""}`}
                            >
                                {item.label}
                                <span className="rounded-full bg-surface px-1.5 py-0.5 text-[10px]">
                                    {item.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {hasActiveFilters && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={clearFilters}>
                            Reset
                        </button>
                    )}
                    <select
                        value={sortMode}
                        onChange={(event) => setSortMode(event.target.value as TaskSortMode)}
                        className="input w-auto py-1.5 text-xs"
                        aria-label="Sort tasks"
                    >
                        <option value="active-first">Active first</option>
                        <option value="alphabetical">A → Z</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="card mb-4 flex flex-col gap-3 border-danger/20 bg-danger/5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-danger">{error}</p>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => loadTasks(true)}>
                        Try again
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="space-y-1.5">
                    <div className="skeleton h-10 w-full" />
                    <div className="skeleton h-10 w-full" />
                    <div className="skeleton h-10 w-full" />
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="card flex flex-col items-center gap-3 py-8 text-center">
                    <div className="empty-icon">📋</div>
                    <div>
                        <h2 className="text-lg font-semibold">
                            {tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
                        </h2>
                        <p className="mt-1 max-w-sm text-sm text-muted">
                            {tasks.length === 0
                                ? "Type in the quick add field above to create your first task."
                                : "Try a different search or filter."}
                        </p>
                    </div>
                    {hasActiveFilters ? (
                        <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                            Reset filters
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => quickInputRef.current?.focus()}
                        >
                            Add a task
                        </button>
                    )}
                </div>
            ) : viewMode === "board" ? (
                <KanbanBoard
                    tasks={filteredTasks}
                    updatingTaskId={updatingTaskId}
                    deletingTaskId={deletingTaskId}
                    confirmDeleteId={confirmDeleteId}
                    {...taskActions}
                />
            ) : (
                <TaskListView
                    activeTasks={activeTasks}
                    completedTasks={completedTasks}
                    filter={filter}
                    showCompleted={showCompleted}
                    onToggleCompleted={() => setShowCompleted((current) => !current)}
                    updatingTaskId={updatingTaskId}
                    deletingTaskId={deletingTaskId}
                    confirmDeleteId={confirmDeleteId}
                    actions={taskActions}
                />
            )}

            <button
                type="button"
                className="fab"
                aria-label="Quick add task"
                onClick={() => {
                    quickInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                    quickInputRef.current?.focus();
                }}
            >
                +
            </button>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    actionLabel={toast.actionLabel}
                    onAction={toast.onAction}
                    onClose={dismissToast}
                />
            )}
        </PageShell>
    );
}

export default function TasksPage() {
    return (
        <Suspense fallback={
            <PageShell>
                <div className="skeleton mb-4 h-28 w-full" />
                <div className="skeleton mb-4 h-20 w-full" />
                <div className="skeleton h-24 w-full" />
            </PageShell>
        }>
            <TasksPageContent />
        </Suspense>
    );
}
