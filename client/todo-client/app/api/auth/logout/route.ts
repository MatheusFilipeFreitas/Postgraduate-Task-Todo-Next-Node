import { clearAuthCookieOnResponse } from "@/lib/auth.cookie.server";
import { NextResponse } from "next/server";

export async function POST() {
    return clearAuthCookieOnResponse(NextResponse.json({ ok: true }));
}
