"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/brand-mark";
import { AuthFormShell } from "@/components/auth-form-shell";
import { AuthMessage } from "@/components/auth-message";
import { SiteHeader } from "@/components/site-header";
import { login } from "@/lib/backend";
import { saveAuthSession } from "@/lib/session";

export function AuthLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const result = await login(email, password);
      saveAuthSession({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
      setMessage("Signed in successfully.");
      const nextPath = searchParams?.get("next");
      router.push(nextPath?.startsWith("/") ? nextPath : "/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-mesh-radial">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 pt-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-blue-500 bg-white text-blue-600 shadow-sm transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>
      <AuthFormShell
        eyebrow="Authentication"
        title="Welcome back"
        description="Sign in to manage orders, checkout, and your medical card."
        mode="login"
        topContent={
          <div className="flex justify-center">
            <BrandMark href="/" />
          </div>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">Password</label>
            <div className="relative">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-ink-700 transition hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
          {message ? <AuthMessage tone="success">{message}</AuthMessage> : null}
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Signing in..." : "Sign in"}
            </Button>
            <Link href="/auth/reset" className="text-sm font-medium text-brand-600">
              Forgot password?
            </Link>
          </div>
        </form>
      </AuthFormShell>
    </div>
  );
}
