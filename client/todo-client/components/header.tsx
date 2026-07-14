"use client";

import { useAuth } from "@/hooks/useAuth";
import MobileNav from "@/components/mobile-nav";
import UserAvatar from "@/components/user-avatar";
import { NAV_ITEMS } from "@/lib/navigation";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const HeaderComponent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout().then(() => {
            router.push("/login");
        });
    };

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                        <Link href="/" className="flex min-w-0 items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                                T
                            </span>
                            <span className="truncate text-base font-semibold tracking-tight">TaskFlow</span>
                        </Link>

                        {isAuthenticated && (
                            <nav className="hidden items-center gap-1 md:flex">
                                {NAV_ITEMS.map((item) => {
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        )}
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                        {isAuthenticated && user && (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="hidden text-right md:block">
                                    <p className="text-sm font-medium">{user.username}</p>
                                    <p className="max-w-[180px] truncate text-xs text-muted">{user.email}</p>
                                </div>
                                <UserAvatar name={user.username} size="sm" />
                            </div>
                        )}

                        {!isAuthenticated ? (
                            <Link href="/login" className="btn btn-primary btn-sm sm:min-h-9 sm:px-3.5 sm:py-2 sm:text-sm">
                                Sign in
                            </Link>
                        ) : (
                            <button
                                className="btn btn-secondary btn-sm sm:min-h-9 sm:px-3.5 sm:py-2 sm:text-sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {isAuthenticated && <MobileNav />}
        </>
    );
};

export default HeaderComponent;
