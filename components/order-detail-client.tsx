"use client";

import { useEffect, useState } from "react";
import { getOrder, type Order } from "@/lib/backend";
import { SectionMessage } from "@/components/section-message";
import { AuthMessage } from "@/components/auth-message";
import { getAuthToken } from "@/lib/session";
import Link from "next/link";

type OrderDetailClientProps = {
  orderId: string;
};

export function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const [token, setToken] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setToken(getAuthToken());
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getOrder(token, orderId)
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load order."))
      .finally(() => setLoading(false));
  }, [token, orderId]);

  useEffect(() => {
    if (!token) return;

    const refreshOrderAfterPayment = (event: Event) => {
      const detail = (event as CustomEvent<{ orderId?: string }>).detail;
      if (detail?.orderId !== orderId) return;
      getOrder(token, orderId).then(setOrder).catch(() => undefined);
    };

    window.addEventListener("wecure:payment-status", refreshOrderAfterPayment);
    return () => window.removeEventListener("wecure:payment-status", refreshOrderAfterPayment);
  }, [orderId, token]);

  if (!token) {
    return (
      <SectionMessage
        title="Sign in to view order details"
        description="Please sign in to view this order."
        action={{ href: `/auth/login?next=/orders/${orderId}`, label: "Sign in" }}
      />
    );
  }

  if (loading) {
    return <SectionMessage title="Loading order" description="Fetching the order details now." />;
  }

  if (!order) {
    return <SectionMessage title="Order not found" description="We could not find this order." />;
  }

  return (
    <div className="space-y-6">
      {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
      <section className="rounded-[2rem] border border-ink-900/10 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
          Order {order.orderNumber || order.id}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-ink-950">{order.status || "processing"}</h1>
        <p className="mt-3 text-sm text-ink-900/60">
          ZMW {Number(order.amount || 0).toFixed(2)}
        </p>
      </section>

      <section className="rounded-[2rem] border border-ink-900/10 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">Payment status</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${paymentStatusClass(order.payment?.status)}`}>
            {formatPaymentStatus(order.payment?.status)}
          </span>
          {order.payment?.referenceId ? (
            <p className="text-sm text-ink-900/60">Reference: {order.payment.referenceId}</p>
          ) : null}
        </div>
        {order.payment?.provider ? (
          <p className="mt-2 text-sm text-ink-900/60">Provider: {order.payment.provider}</p>
        ) : null}
        {order.payment?.status !== "successful" ? (
          <Link href={`/checkout/${order.id}`} className="mt-5 inline-flex rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
            {order.payment ? "Continue payment" : "Pay for this order"}
          </Link>
        ) : null}
      </section>

      <section className="rounded-[2rem] border border-ink-900/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-ink-950">Items</h2>
        <div className="mt-4 space-y-3">
          {order.items?.map((item) => (
            <div key={item.productId} className="flex items-center justify-between rounded-2xl bg-sand-50 px-4 py-3">
              <div>
                <p className="font-medium text-ink-950">{item.name}</p>
                <p className="text-sm text-ink-900/60">Qty {item.quantity}</p>
              </div>
              <p className="font-medium text-ink-950">ZMW {Number(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatPaymentStatus(status?: string) {
  const value = (status || "not started").replace(/_/g, " ");
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function paymentStatusClass(status?: string) {
  switch (status) {
    case "successful":
      return "bg-emerald-50 text-emerald-700";
    case "failed":
      return "bg-rose-50 text-rose-700";
    case "initiated":
    case "pending":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
