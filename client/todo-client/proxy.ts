import { NextRequest, NextResponse } from "next/server";
import { AUTH_JWT_COOKIE_NAME } from "./lib/auth-cookie.constants";

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith("/api/")) {
        return NextResponse.next();
    }

    const isAuthenticated = !!request.cookies.get(AUTH_JWT_COOKIE_NAME)?.value;
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    if (isAuthPage) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ]
}