import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_MAX_AGE, AUTH_JWT_COOKIE_NAME } from "./auth-cookie.constants";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE
        ? process.env.COOKIE_SECURE === "true"
        : process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

export function setAuthCookieOnResponse(response: NextResponse, jwt: string): NextResponse {
    response.cookies.set(AUTH_JWT_COOKIE_NAME, jwt, {
        ...cookieOptions,
        maxAge: AUTH_COOKIE_MAX_AGE,
    });
    return response;
}

export function clearAuthCookieOnResponse(response: NextResponse): NextResponse {
    response.cookies.set(AUTH_JWT_COOKIE_NAME, "", {
        ...cookieOptions,
        maxAge: 0,
    });
    return response;
}

export async function getAuthTokenFromCookies(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_JWT_COOKIE_NAME)?.value;
}
