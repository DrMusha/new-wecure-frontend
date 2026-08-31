"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthFormShell } from "@/components/auth-form-shell";
import { AuthMessage } from "@/components/auth-message";
import { submitVerification } from "@/lib/backend";

export function AuthNewVerificationClient() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params?.get("token") || "";
  const [manualToken, setManualToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const value = token || manualToken;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const result = await submitVerification(value);
      setMessage(result.message || "Email verified.");
      router.push("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
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
        eyebrow="Verification"
        title="Verify your email"
        description="Paste the token from your verification email or open the link directly."
        mode="verify"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">Verification token</label>
            <Input value={token || manualToken} onChange={(e) => setManualToken(e.target.value)} placeholder="Enter token" />
          </div>
          {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
          {message ? <AuthMessage tone="success">{message}</AuthMessage> : null}
          <Button type="submit" disabled={pending || !value}>
            {pending ? "Verifying..." : "Verify email"}
          </Button>
        </form>
      </AuthFormShell>
    </div>
  );
}
