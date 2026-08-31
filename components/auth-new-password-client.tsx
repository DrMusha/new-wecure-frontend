"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthFormShell } from "@/components/auth-form-shell";
import { AuthMessage } from "@/components/auth-message";
import { submitNewPassword } from "@/lib/backend";

const RESET_TOKEN_STORAGE_KEY = "wecure-reset-token";
const RESET_EMAIL_STORAGE_KEY = "wecure-reset-email";

export function AuthNewPasswordClient() {
  const router = useRouter();
  const params = useSearchParams();
  const queryToken = params?.get("token") || "";
  const [token, setToken] = useState(queryToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!queryToken) {
      const storedToken = window.sessionStorage.getItem(RESET_TOKEN_STORAGE_KEY) || "";
      setToken(storedToken);
    }

    setEmail(window.sessionStorage.getItem(RESET_EMAIL_STORAGE_KEY) || "");
  }, [queryToken]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setPending(false);
      setError("Passwords do not match.");
      return;
    }

    try {
      const result = await submitNewPassword(token, password);
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(RESET_TOKEN_STORAGE_KEY);
        window.sessionStorage.removeItem(RESET_EMAIL_STORAGE_KEY);
      }
      setMessage(result.message || "Password updated.");
      router.push("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-mesh-radial">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.24em] text-ink-700">
          WeCure
        </Link>
      </div>
      <AuthFormShell
        eyebrow="Recovery"
        title="Choose a new password"
        description={email ? `Create a new password for ${email}.` : "Create a new password for your account."}
        mode="password"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">New password</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">Confirm new password</label>
            <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" autoComplete="new-password" required />
          </div>
          {!token ? <AuthMessage tone="error">Please restart the reset flow and verify your OTP first.</AuthMessage> : null}
          {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
          {message ? <AuthMessage tone="success">{message}</AuthMessage> : null}
          <Button type="submit" disabled={pending || !token}>
            {pending ? "Saving..." : "Save new password"}
          </Button>
        </form>
      </AuthFormShell>
    </div>
  );
}
