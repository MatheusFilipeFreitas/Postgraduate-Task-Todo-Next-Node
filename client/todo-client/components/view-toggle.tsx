"use client";

type ViewToggleProps<T extends string> = {
    value: T;
    options: { value: T; label: string }[];
    onChange: (value: T) => void;
};

export default function ViewToggle<T extends string>({
    value,
    options,
    onChange,
}: ViewToggleProps<T>) {
    return (
        <div className="view-toggle" role="tablist" aria-label="View mode">
            {options.map((option) => {
                const isActive = value === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(option.value)}
                        className={`view-toggle-btn ${isActive ? "view-toggle-btn-active" : ""}`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
