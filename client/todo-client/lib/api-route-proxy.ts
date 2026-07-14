import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api.server";

export async function proxyJsonRequest(
    request: NextRequest,
    upstreamPath: string,
    method: "POST" | "PATCH" | "DELETE",
) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const upstream = await apiFetch(upstreamPath, {
        method,
        body: JSON.stringify(body),
    });
    const data = await upstream.json().catch(() => ({}));

    return NextResponse.json(data, { status: upstream.status });
}

export async function proxyEmptyRequest(
    upstreamPath: string,
    method: "DELETE",
) {
    const upstream = await apiFetch(upstreamPath, { method });

    if (upstream.status === 204) {
        return new NextResponse(null, { status: 204 });
    }

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
}
