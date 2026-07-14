'use client';

import { useAuth } from "@/hooks/useAuth";
import PageShell from "@/components/page-shell";
import { UserLogin } from "@/models/user.model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const LoginPage = () => {
    const { login, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const [userLogin, setUserLogin] = useState<UserLogin>({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/tasks");
        }
    }, [isAuthenticated, isLoading, router]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await login(userLogin);
            router.push("/tasks");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <PageShell className="items-center justify-center">
                <div className="card w-full max-w-md space-y-4">
                    <div className="skeleton mx-auto h-8 w-40" />
                    <div className="skeleton h-10 w-full" />
                    <div className="skeleton h-10 w-full" />
                    <div className="skeleton h-10 w-full" />
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell className="items-center justify-center">
            <div className="grid w-full max-w-3xl gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="hero-panel hidden lg:flex lg:flex-col lg:justify-between">
                    <div className="relative">
                        <p className="text-xs font-medium text-primary">TaskFlow</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                            Focus on work,<br />not the tool.
                        </h1>
                        <p className="mt-3 max-w-sm text-sm text-muted">
                            Track tasks, update status in one click, and keep momentum with a clean workspace.
                        </p>
                    </div>
                    <ul className="relative m-0 list-none space-y-2 p-0 text-xs text-muted">
                        <li>✓ Quick add with keyboard shortcut</li>
                        <li>✓ Filter, search, and progress tracking</li>
                        <li>✓ Undo deletes and optimistic updates</li>
                    </ul>
                </section>

                <div className="card w-full">
                    <div className="mb-4">
                        <p className="text-xs font-medium text-primary lg:hidden">TaskFlow</p>
                        <h2 className="mt-0.5 text-2xl font-semibold tracking-tight">Welcome back</h2>
                        <p className="mt-1 text-sm text-muted">Sign in to manage your tasks.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="flex flex-col gap-2">
                            <span className="label">Email</span>
                            <input
                                type="email"
                                value={userLogin.email}
                                onChange={(event) => setUserLogin({ email: event.target.value, password: userLogin.password })}
                                className="input"
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </label>

                        <label className="flex flex-col gap-2">
                            <span className="label">Password</span>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={userLogin.password}
                                    onChange={(event) => setUserLogin({ email: userLogin.email, password: event.target.value })}
                                    className="input pr-24"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowPassword((current) => !current)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </label>

                        {error && (
                            <p className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger">
                                {error}
                            </p>
                        )}

                        <button type="submit" className="btn btn-primary mt-2 w-full" disabled={submitting}>
                            {submitting ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-muted">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="link">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </PageShell>
    );
};

export default LoginPage;
