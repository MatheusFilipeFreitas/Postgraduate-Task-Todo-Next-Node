import { User, UserLogin, UserRegister } from "@/models/user.model";
import { AuthSession } from "./auth.context";

type LoginApiResponse = {
    user: User;
    expiresAt: number;
};

type ApiErrorResponse = {
    error?: string;
};

export async function loginRequest(userLogin: UserLogin): Promise<AuthSession> {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userLogin),
        credentials: "include",
    });

    if (!response.ok) {
        const errorBody = (await response.json().catch(() => ({}))) as ApiErrorResponse;
        throw new Error(errorBody.error ?? "Login failed");
    }

    const data = (await response.json()) as LoginApiResponse;

    return {
        user: data.user,
        expiresAt: data.expiresAt,
    };
}

export async function registerRequest(userRegister: UserRegister): Promise<User> {
    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userRegister),
        credentials: "include",
    });

    if (!response.ok) {
        const errorBody = (await response.json().catch(() => ({}))) as ApiErrorResponse;
        throw new Error(errorBody.error ?? "Registration failed");
    }

    const data = (await response.json()) as { user: User };
    return data.user;
}

export async function logoutRequest(): Promise<void> {
    await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
    });
}

export async function sessionRequest(): Promise<boolean> {
    const response = await fetch("/api/auth/session", {
        credentials: "include",
    });

    return response.ok;
}
