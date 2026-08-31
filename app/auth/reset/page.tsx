"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthFormShell } from "@/components/auth-form-shell";
import { AuthMessage } from "@/components/auth-message";
import { requestPasswordReset } from "@/lib/backend";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message || "Reset email sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset request failed.");
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
        title="Reset your password"
        description="We'll email you a reset link to help you sign back in."
        mode="reset"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
          </div>
          {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
          {message ? <AuthMessage tone="success">{message}</AuthMessage> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Sending..." : "Send reset email"}
          </Button>
        </form>
      </AuthFormShell>
    </div>
  );
}
