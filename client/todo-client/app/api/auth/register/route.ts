import { apiFetch } from "@/lib/api.server";
import { NextRequest, NextResponse } from "next/server";

type RegisterResponse = {
    id: string;
    email: string;
    username: string;
};

type ApiErrorResponse = {
    error?: string;
};

export async function POST(request: NextRequest) {
    let body: { username?: string; email?: string; password?: string };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const upstream = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
    });

    if (!upstream.ok) {
        const errorBody = (await upstream.json().catch(() => ({}))) as ApiErrorResponse;
        return NextResponse.json(
            { error: errorBody.error ?? "Registration failed" },
            { status: upstream.status }
        );
    }

    const data = (await upstream.json()) as RegisterResponse;

    return NextResponse.json(
        { user: { id: data.id, email: data.email, username: data.username } },
        { status: 201 }
    );
}
