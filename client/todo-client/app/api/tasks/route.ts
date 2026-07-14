import { apiFetch } from "@/lib/api.server";
import { proxyEmptyRequest, proxyJsonRequest } from "@/lib/api-route-proxy";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const upstream = await apiFetch("/tasks");
    const data = await upstream.json().catch(() => ({}));

    return NextResponse.json(data, { status: upstream.status });
}

export async function POST(request: NextRequest) {
    return proxyJsonRequest(request, "/tasks", "POST");
}

export async function PATCH(request: NextRequest) {
    const taskId = request.nextUrl.searchParams.get("id");
    return proxyJsonRequest(request, `/tasks/${taskId}`, "PATCH");
}

export async function DELETE(request: NextRequest) {
    const taskId = request.nextUrl.searchParams.get("id");
    return proxyEmptyRequest(`/tasks/${taskId}`, "DELETE");
}
