"use client";

import { NAV_ITEMS } from "@/lib/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="mobile-nav" aria-label="Main navigation">
            <div className="mx-auto flex max-w-lg items-stretch gap-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={`mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`}
                        >
                            <span className="text-sm leading-none">{item.icon}</span>
                            <span>{item.mobileLabel}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
