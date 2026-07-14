"use client";

import { useCallback, useState } from "react";

export type ToastState = {
    message: string;
    type: "success" | "error";
    duration?: number;
    actionLabel?: string;
    onAction?: () => void;
};

export function useToast() {
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = useCallback((nextToast: ToastState) => {
        setToast(nextToast);
    }, []);

    const dismissToast = useCallback(() => {
        setToast(null);
    }, []);

    return { toast, showToast, dismissToast };
}
