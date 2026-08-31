"use client";

import { useEffect, useState } from "react";
import { AuthMessage } from "@/components/auth-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reconcilePayment } from "@/lib/backend";
import { getAuthToken, getAuthUser } from "@/lib/session";
import { SectionMessage } from "@/components/section-message";

type FormState = {
  paymentId: string;
  referenceId: string;
  orderId: string;
};

export function AdminPaymentReconcile() {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState<FormState>({
    paymentId: "",
    referenceId: "",
    orderId: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const nextToken = getAuthToken();
    const user = getAuthUser();
    setToken(nextToken);
    setIsAdmin(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN");
    setReady(true);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError("Please sign in first.");
      return;
    }
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const result = await reconcilePayment(token, {
        paymentId: form.paymentId.trim() || undefined,
        referenceId: form.referenceId.trim() || undefined,
        orderId: form.orderId.trim() || undefined,
      });
      setMessage(result.queued ? "Reconciliation queued successfully." : "Request submitted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reconciliation failed.");
    } finally {
      setPending(false);
    }
  }

  if (!ready || !token) {
    return (
      <SectionMessage
        title="Sign in to access admin payment tools"
        description="The reconciliation endpoint is protected by the backend bearer token."
      />
    );
  }

  if (!isAdmin) {
    return (
      <SectionMessage
        title="Admin access required"
        description="Your current account does not have permission to use the payment reconciliation endpoint."
      />
    );
  }

  return (
    <section className="rounded-[2rem] border border-ink-900/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
        Admin payments
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-ink-950">Queue payment reconciliation</h2>
      <p className="mt-2 text-sm leading-7 text-ink-900/60">
        Use one of these identifiers to ask the backend worker to sync with the provider.
      </p>

      {error ? <div className="mt-4"><AuthMessage tone="error">{error}</AuthMessage></div> : null}
      {message ? <div className="mt-4"><AuthMessage tone="success">{message}</AuthMessage></div> : null}

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <Input value={form.paymentId} onChange={(e) => setForm((prev) => ({ ...prev, paymentId: e.target.value }))} placeholder="Payment ID" />
        <Input value={form.referenceId} onChange={(e) => setForm((prev) => ({ ...prev, referenceId: e.target.value }))} placeholder="Reference ID" />
        <Input value={form.orderId} onChange={(e) => setForm((prev) => ({ ...prev, orderId: e.target.value }))} placeholder="Order ID" />
        <Button type="submit" disabled={pending}>
          {pending ? "Queueing..." : "Queue reconciliation"}
        </Button>
      </form>
    </section>
  );
}
