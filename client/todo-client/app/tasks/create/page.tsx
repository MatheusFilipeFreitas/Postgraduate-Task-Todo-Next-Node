"use client";

import PageShell from "@/components/page-shell";
import Toast from "@/components/toast";
import { useToast } from "@/hooks/useToast";
import { createTask } from "@/lib/tasks.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateTaskPage = () => {
    const router = useRouter();
    const { toast, showToast, dismissToast } = useToast();
    const [title, setTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            setError("Please enter a task title.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await createTask(trimmedTitle);
            showToast({ message: "Task created successfully", type: "success" });
            setTimeout(() => router.push("/tasks"), 600);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create task.");
            setIsSubmitting(false);
        }
    };

    return (
        <PageShell className="max-w-lg">
            <Link href="/tasks" className="link mb-4 inline-flex items-center gap-1 text-xs">
                ← Back to tasks
            </Link>

            <div className="card">
                <div className="mb-4">
                    <p className="text-xs font-medium text-primary">New task</p>
                    <h1 className="mt-0.5 text-2xl font-semibold tracking-tight">Create a task</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2">
                        <span className="label">Task title</span>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="e.g. Finish project report"
                            className="input"
                            autoFocus
                            required
                        />
                        <span className="text-xs text-muted">
                            Keep it short — update status on the board later.
                        </span>
                    </label>

                    {error && (
                        <p className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger">
                            {error}
                        </p>
                    )}

                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create task"}
                        </button>
                        <Link href="/tasks" className="btn btn-secondary w-full sm:w-auto">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={dismissToast}
                />
            )}
        </PageShell>
    );
};

export default CreateTaskPage;
