"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthFormShell } from "@/components/auth-form-shell";
import { AuthMessage } from "@/components/auth-message";
import { submitNewPassword } from "@/lib/backend";

export function AuthNewPasswordClient() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params?.get("token") || "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const result = await submitNewPassword(token, password);
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
        description="Use the token from your email reset link."
        mode="password"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">Reset token</label>
            <Input value={token} readOnly />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">New password</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" required />
          </div>
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
