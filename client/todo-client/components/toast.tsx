"use client";

import { useEffect } from "react";

type ToastProps = {
    message: string;
    type?: "success" | "error";
    duration?: number;
    actionLabel?: string;
    onAction?: () => void;
    onClose: () => void;
};

export default function Toast({
    message,
    type = "success",
    duration = 3000,
    actionLabel,
    onAction,
    onClose,
}: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div
            className={`toast toast-enter ${type === "error" ? "toast-error" : "toast-success"}`}
            role="status"
        >
            <span className="text-base">{type === "error" ? "✕" : "✓"}</span>
            <span className="flex-1">{message}</span>
            {actionLabel && onAction && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
                Dismiss
            </button>
        </div>
    );
}
