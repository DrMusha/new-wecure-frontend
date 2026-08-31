"use client";

import { useEffect, useState } from "react";
import { getOrder, type Order } from "@/lib/backend";
import { SectionMessage } from "@/components/section-message";
import { AuthMessage } from "@/components/auth-message";
import { getAuthToken } from "@/lib/session";

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

  if (!token) {
    return (
      <SectionMessage
        title="Sign in to view order details"
        description="We need the backend token to read this order."
      />
    );
  }

  if (loading) {
    return <SectionMessage title="Loading order" description="Fetching the order details now." />;
  }

  if (!order) {
    return <SectionMessage title="Order not found" description="The backend did not return this order." />;
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
