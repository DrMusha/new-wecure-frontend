"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ReceiptText } from "lucide-react";
import { AuthMessage } from "@/components/auth-message";
import { PaymentPanel } from "@/components/payment-panel";
import { SectionMessage } from "@/components/section-message";
import { getOrder, type Order } from "@/lib/backend";
import { getAuthToken } from "@/lib/session";
import { cn } from "@/lib/utils";

type CheckoutClientProps = {
  orderId: string;
};

const MOBILE_ITEM_LIMIT = 3;

export function CheckoutClient({ orderId }: CheckoutClientProps) {
  const [token, setToken] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsOpen, setItemsOpen] = useState(false);

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
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load this order."))
      .finally(() => setLoading(false));
  }, [orderId, token]);

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

  const itemCount = useMemo(
    () => order?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    [order?.items],
  );
  const visibleItems = itemsOpen ? order?.items || [] : (order?.items || []).slice(0, MOBILE_ITEM_LIMIT);
  const hiddenItemCount = Math.max((order?.items?.length || 0) - MOBILE_ITEM_LIMIT, 0);

  if (!token) {
    return (
      <SectionMessage
        title="Sign in to continue"
        description="Please sign in to complete payment for this order."
        action={{ href: `/auth/login?next=/checkout/${orderId}`, label: "Sign in" }}
      />
    );
  }

  if (loading) {
    return <SectionMessage title="Loading checkout" description="Fetching your order and payment details." />;
  }

  if (!order) {
    return <SectionMessage title="Order not found" description="We could not find this order." />;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-8">
      <aside className="overflow-hidden rounded-[1.5rem] border border-white/80 bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.55)] sm:rounded-[2rem]">
        <div className="bg-ink-950 px-5 py-5 text-white sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
                Order {order.orderNumber || order.id}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Payment summary</h2>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <ReceiptText className="h-5 w-5 text-brand-200" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs text-white/60">Total</p>
              <p className="mt-1 text-2xl font-semibold">ZMW {Number(order.amount || 0).toFixed(2)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs text-white/60">Items</p>
              <p className="mt-1 text-2xl font-semibold">{itemCount}</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink-950">Order items</p>
              <p className="mt-1 text-xs text-ink-900/55">Review before sending payment.</p>
            </div>
            {hiddenItemCount > 0 ? (
              <button
                type="button"
                onClick={() => setItemsOpen((current) => !current)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
              >
                {itemsOpen ? "Show less" : `+${hiddenItemCount} more`}
                <ChevronDown className={cn("h-4 w-4 transition", itemsOpen ? "rotate-180" : "")} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {error ? <div className="mt-4"><AuthMessage tone="error">{error}</AuthMessage></div> : null}

          <div className="mt-4 space-y-2.5">
            {visibleItems.map((item) => (
              <div key={item.productId} className="flex items-start justify-between gap-4 rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-950">{item.name}</p>
                  <p className="mt-1 text-sm text-ink-900/60">Qty {item.quantity}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-ink-950">
                  ZMW {Number(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <Link
            href={`/orders/${order.id}`}
            className="mt-5 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            View order details
          </Link>
        </div>
      </aside>

      <PaymentPanel orderId={order.id} amount={order.amount} orderNumber={order.orderNumber} />
    </div>
  );
}
