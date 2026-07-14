import { Request } from "express";
import { AUTH_JWT_COOKIE_NAME } from "./auth-cookie";

export function extractAuthToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    return token || null;
  }

  const cookieToken = req.cookies?.[AUTH_JWT_COOKIE_NAME];

  if (typeof cookieToken === "string" && cookieToken) {
    return cookieToken;
  }

  return null;
}
