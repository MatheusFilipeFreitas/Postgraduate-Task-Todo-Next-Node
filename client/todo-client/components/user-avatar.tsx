type UserAvatarProps = {
    name: string;
    size?: "sm" | "md";
};

function getInitials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function UserAvatar({ name, size = "md" }: UserAvatarProps) {
    const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary ${sizeClass}`}
            aria-hidden="true"
        >
            {getInitials(name)}
        </span>
    );
}
