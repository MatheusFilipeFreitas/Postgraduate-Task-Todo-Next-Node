type ProgressBarProps = {
    value: number;
    max?: number;
    label?: string;
    showPercent?: boolean;
};

export default function ProgressBar({
    value,
    max = 100,
    label,
    showPercent = true,
}: ProgressBarProps) {
    const percent = max === 0 ? 0 : Math.round((value / max) * 100);

    return (
        <div className="space-y-2">
            {(label || showPercent) && (
                <div className="flex items-center justify-between gap-3 text-sm">
                    {label && <span className="font-medium text-muted">{label}</span>}
                    {showPercent && <span className="font-semibold text-primary">{percent}%</span>}
                </div>
            )}
            <div className="progress-track" aria-hidden="true">
                <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}
