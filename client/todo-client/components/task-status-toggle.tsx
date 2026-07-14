"use client";

import { STATUS_TOGGLE_OPTIONS } from "@/lib/task-status";
import { TaskStatus } from "@/models/task.model";

type TaskStatusToggleProps = {
    value: TaskStatus;
    onChange: (status: TaskStatus) => void;
    disabled?: boolean;
    compact?: boolean;
};

export default function TaskStatusToggle({
    value,
    onChange,
    disabled = false,
    compact = false,
}: TaskStatusToggleProps) {
    return (
        <div
            className="inline-flex rounded-lg border border-border bg-surface-muted p-0.5"
            role="group"
            aria-label="Task status"
        >
            {STATUS_TOGGLE_OPTIONS.map((option) => {
                const isActive = value === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(option.value)}
                        className={`rounded-md px-2 py-1 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            isActive
                                ? "bg-surface text-foreground shadow-sm"
                                : "text-muted hover:text-foreground"
                        }`}
                        aria-pressed={isActive}
                    >
                        {compact ? option.shortLabel : option.label}
                    </button>
                );
            })}
        </div>
    );
}
