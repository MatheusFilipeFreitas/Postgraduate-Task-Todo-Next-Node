type TaskCheckboxProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label: string;
};

export default function TaskCheckbox({
    checked,
    onChange,
    disabled = false,
    label,
}: TaskCheckboxProps) {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={checked}
            aria-label={`Mark "${label}" as ${checked ? "incomplete" : "complete"}`}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`task-checkbox ${checked ? "task-checkbox-checked" : ""}`}
        >
            {checked && <span className="text-[10px] font-bold text-white">✓</span>}
        </button>
    );
}
