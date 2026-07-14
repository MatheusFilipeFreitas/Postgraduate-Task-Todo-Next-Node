"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/useToast";
import ProgressBar from "@/components/progress-bar";
import QuickAddForm from "@/components/quick-add-form";
import Toast from "@/components/toast";
import { HOME_STAT_LINKS, STATUS_LABELS } from "@/lib/task-status";
import { computeTaskStats } from "@/lib/task-stats";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import PageShell from "./page-shell";

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

export default function HomeDashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { toast, showToast, dismissToast } = useToast();
    const {
        tasks,
        isLoading: loadingTasks,
        createTaskWithNotify,
        changeStatus,
    } = useTasks({ onNotify: showToast });

    const [quickTitle, setQuickTitle] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [startingTaskId, setStartingTaskId] = useState<string | null>(null);

    const stats = useMemo(() => computeTaskStats(tasks), [tasks]);
    const recentTasks = tasks.slice(0, 5);
    const nextUp = tasks.find((task) => task.status === "pending")
        ?? tasks.find((task) => task.status === "in_progress");

    const handleQuickCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const title = quickTitle.trim();

        if (!title) return;

        setIsCreating(true);

        try {
            await createTaskWithNotify(title);
            setQuickTitle("");
        } catch {
        } finally {
            setIsCreating(false);
        }
    };

    const handleStartNext = async () => {
        if (!nextUp || nextUp.status === "in_progress") {
            router.push("/tasks?filter=in_progress");
            return;
        }

        setStartingTaskId(nextUp.id);

        try {
            await changeStatus(nextUp.id, "in_progress");
            router.push("/tasks?filter=in_progress");
        } catch {
        } finally {
            setStartingTaskId(null);
        }
    };

    if (isLoading) {
        return (
            <PageShell>
                <div className="skeleton h-36 w-full" />
            </PageShell>
        );
    }

    return (
        <PageShell>
            <section className="hero-panel mb-4">
                <div className="relative flex flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-medium text-primary">{getGreeting()}</p>
                            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">
                                {user?.username ?? "there"}
                            </h1>
                            <p className="mt-1 max-w-lg text-sm text-muted">
                                {nextUp
                                    ? <>Next: <span className="font-medium text-foreground">{nextUp.title}</span></>
                                    : "All caught up — add something new."}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {nextUp && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={handleStartNext}
                                    disabled={startingTaskId === nextUp.id}
                                >
                                    {startingTaskId === nextUp.id
                                        ? "Starting..."
                                        : nextUp.status === "in_progress"
                                            ? "Continue"
                                            : "Start next"}
                                </button>
                            )}
                            <Link href="/tasks" className="btn btn-secondary btn-sm">
                                Open board
                            </Link>
                        </div>
                    </div>

                    <QuickAddForm
                        value={quickTitle}
                        onChange={setQuickTitle}
                        onSubmit={handleQuickCreate}
                        isSubmitting={isCreating}
                        placeholder="Quick capture a task..."
                        inputId="home-quick-title"
                        className="flex flex-col gap-2 sm:flex-row sm:items-center"
                    />
                </div>
            </section>

            <section className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {HOME_STAT_LINKS.map((item) => {
                    const count = item.key === "all"
                        ? stats.all
                        : stats[item.key];

                    const href = item.filter ? `/tasks?filter=${item.filter}` : "/tasks";

                    return (
                        <Link key={item.key} href={href} className="stat-card">
                            <p className="text-[10px] font-medium uppercase tracking-wide text-muted">{item.label}</p>
                            <p className={`mt-0.5 text-xl font-semibold ${item.color}`}>
                                {loadingTasks ? "—" : count}
                            </p>
                        </Link>
                    );
                })}
            </section>

            {stats.all > 0 && (
                <section className="card mb-4">
                    <ProgressBar
                        value={stats.completed}
                        max={stats.all}
                        label="Progress"
                    />
                </section>
            )}

            <section className="card">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">Recent tasks</h2>
                    <Link href="/tasks" className="link text-xs">
                        View all
                    </Link>
                </div>

                {loadingTasks ? (
                    <div className="space-y-2">
                        <div className="skeleton h-10 w-full" />
                        <div className="skeleton h-10 w-full" />
                    </div>
                ) : recentTasks.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted">
                        No tasks yet. Use quick capture above.
                    </p>
                ) : (
                    <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                        {recentTasks.map((task) => (
                            <li key={task.id}>
                                <Link
                                    href={`/tasks?filter=${task.status}`}
                                    className="recent-task-row"
                                >
                                    <span className={`truncate text-sm font-medium ${task.status === "completed" ? "task-title-completed" : ""}`}>
                                        {task.title}
                                    </span>
                                    <span className={`recent-task-dot recent-task-dot-${task.status}`} title={STATUS_LABELS[task.status]} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

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
