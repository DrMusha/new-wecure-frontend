"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthFormShell } from "@/components/auth-form-shell";
import { AuthMessage } from "@/components/auth-message";
import { requestPasswordReset, verifyPasswordResetOtp } from "@/lib/backend";
import { SiteHeader } from "@/components/site-header";

const RESET_TOKEN_STORAGE_KEY = "wecure-reset-token";
const RESET_EMAIL_STORAGE_KEY = "wecure-reset-email";

export default function ResetPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSendOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const result = await requestPasswordReset(email);
      setOtpSent(true);
      setMessage(result.message || "A reset code has been sent to your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset request failed.");
    } finally {
      setPending(false);
    }
  }

  async function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const result = await verifyPasswordResetOtp(email, otp);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(RESET_TOKEN_STORAGE_KEY, result.token);
        window.sessionStorage.setItem(RESET_EMAIL_STORAGE_KEY, email);
      }
      router.push("/auth/new-password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-mesh-radial">
      <SiteHeader />
      <AuthFormShell
        eyebrow="Recovery"
        title={otpSent ? "Enter your reset code" : "Reset your password"}
        description={otpSent ? "Enter the one-time password we sent to your email to continue." : "Enter your email and we will send you a one-time password to reset your account."}
        mode="reset"
      >
        {!otpSent ? (
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-900">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
            </div>
            {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
            {message ? <AuthMessage tone="success">{message}</AuthMessage> : null}
            <Button type="submit" disabled={pending}>
              {pending ? "Sending..." : "Send code"}
            </Button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-900">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-900">OTP</label>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} inputMode="numeric" autoComplete="one-time-code" maxLength={6} required />
            </div>
            {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
            {message ? <AuthMessage tone="success">{message}</AuthMessage> : null}
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={pending}>
                {pending ? "Verifying..." : "Verify code"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setOtpSent(false); setOtp(""); setMessage(null); setError(null); }}>
                Use a different email
              </Button>
            </div>
          </form>
        )}
      </AuthFormShell>
    </div>
  );
}
