import { env } from "./env";

export function apiUrl(path: string): string {
  const base = env.apiUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
