import { getAuthTokenFromCookies } from "./auth.cookie.server";
import { apiUrl } from "./api";

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const { headers, ...rest } = init ?? {};
  const requestHeaders = new Headers(headers);
  const token = await getAuthTokenFromCookies();

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (rest.body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  return fetch(apiUrl(path), {
    ...rest,
    headers: requestHeaders,
  });
}
