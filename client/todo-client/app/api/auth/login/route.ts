import { apiFetch } from "@/lib/api.server";
import { setAuthCookieOnResponse } from "@/lib/auth.cookie.server";
import { NextRequest, NextResponse } from "next/server";

type LoginResponse = {
    id: string;
    email: string;
    username: string;
    token: string;
};

type ApiErrorResponse = {
    error?: string;
};

export async function POST(request: NextRequest) {
    let body: { email?: string; password?: string };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const upstream = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
    });

    if (!upstream.ok) {
        const errorBody = (await upstream.json().catch(() => ({}))) as ApiErrorResponse;
        return NextResponse.json(
            { error: errorBody.error ?? "Login failed" },
            { status: upstream.status }
        );
    }

    const data = (await upstream.json()) as LoginResponse;

    const response = NextResponse.json({
        user: { id: data.id, email: data.email, username: data.username },
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return setAuthCookieOnResponse(response, data.token);
}
