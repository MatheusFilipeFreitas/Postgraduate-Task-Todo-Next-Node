type TaskDeleteConfirmProps = {
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function TaskDeleteConfirm({
    isDeleting,
    onConfirm,
    onCancel,
}: TaskDeleteConfirmProps) {
    return (
        <div className="task-delete-confirm" role="group" aria-label="Confirm delete">
            <span className="task-delete-confirm-label">Delete?</span>
            <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={onConfirm}
                disabled={isDeleting}
            >
                {isDeleting ? "..." : "Yes"}
            </button>
            <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={onCancel}
                disabled={isDeleting}
            >
                No
            </button>
        </div>
    );
}
