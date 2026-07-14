import { RefObject } from "react";

type QuickAddFormProps = {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
    placeholder?: string;
    inputId?: string;
    inputRef?: RefObject<HTMLInputElement | null>;
    className?: string;
    submitLabel?: string;
    submittingLabel?: string;
};

export default function QuickAddForm({
    value,
    onChange,
    onSubmit,
    isSubmitting,
    placeholder = "Quick add a task...",
    inputId = "quick-add",
    inputRef,
    className = "flex flex-col gap-2 sm:flex-row sm:items-center",
    submitLabel = "Add",
    submittingLabel = "...",
}: QuickAddFormProps) {
    return (
        <form onSubmit={onSubmit} className={className}>
            <input
                ref={inputRef}
                id={inputId}
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="input flex-1"
                disabled={isSubmitting}
                aria-label="Quick add task"
            />
            <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto"
                disabled={isSubmitting || !value.trim()}
            >
                {isSubmitting ? submittingLabel : submitLabel}
            </button>
        </form>
    );
}
