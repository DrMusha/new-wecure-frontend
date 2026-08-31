"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthFormShell } from "@/components/auth-form-shell";
import { AuthMessage } from "@/components/auth-message";
import { register } from "@/lib/backend";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
      await register({ name, email, password });
      setMessage("Account created. You can now sign in.");
      router.push("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
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
        eyebrow="Authentication"
        title="Create your account"
        description="Register to place orders and track your health data."
        mode="register"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">Password</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" required />
          </div>
          {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
          {message ? <AuthMessage tone="success">{message}</AuthMessage> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </AuthFormShell>
    </div>
  );
}
