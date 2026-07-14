'use client';

import { User, UserLogin, UserRegister } from "@/models/user.model";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { loginRequest, logoutRequest, registerRequest, sessionRequest } from "./auth.api";

export type AuthSession = {
    user: User;
    expiresAt: number;
}

export type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userLogin: UserLogin) => Promise<void>;
    register: (userRegister: UserRegister) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
});

const STORAGE_KEY = "auth-session";

function isSessionValid(session: AuthSession) {
    return Date.now() < session.expiresAt;
}

export default function AuthProvider({ children }: { children: React.ReactNode }): React.ReactNode {
    const [session, setSession] = useState<AuthSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const persistSession = useCallback((nextSession: AuthSession | null) => {
        setSession(nextSession);

        if (nextSession) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
        } else {
            sessionStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const clearSession = useCallback(async () => {
        await logoutRequest().catch(() => {});
        persistSession(null);
    }, [persistSession]);

    const login = useCallback(async (userLogin: UserLogin) => {
        const response = await loginRequest(userLogin);
        persistSession(response);
    }, [persistSession]);

    const register = useCallback(async (userRegister: UserRegister) => {
        await registerRequest(userRegister);
        const response = await loginRequest({
            email: userRegister.email,
            password: userRegister.password,
        });
        persistSession(response);
    }, [persistSession]);

    const logout = useCallback(async () => {
        await clearSession();
    }, [clearSession]);

    useEffect(() => {
        async function hydrate() {
            const stored = sessionStorage.getItem(STORAGE_KEY);

            if (!stored) {
                setIsLoading(false);
                return;
            }

            try {
                const parsed = JSON.parse(stored) as AuthSession;
                const hasValidCookie = await sessionRequest();

                if (hasValidCookie && isSessionValid(parsed)) {
                    persistSession(parsed);
                } else {
                    await clearSession();
                }
            } catch {
                await clearSession();
            } finally {
                setIsLoading(false);
            }
        }
        hydrate();
    }, [persistSession, clearSession]);

    const value = useMemo(() => ({
        user: session?.user ?? null,
        isAuthenticated: !!session?.user && isSessionValid(session),
        isLoading,
        login,
        register,
        logout,
    }), [session, isLoading, login, register, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
