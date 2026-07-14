import { getAuthTokenFromCookies } from "@/lib/auth.cookie.server";
import { NextResponse } from "next/server";

export async function GET() {
    const token = await getAuthTokenFromCookies();

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
}
