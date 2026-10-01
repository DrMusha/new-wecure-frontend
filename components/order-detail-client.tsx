"use client";

import { useEffect, useState } from "react";
import { getOrder, type Order } from "@/lib/backend";
import { SectionMessage } from "@/components/section-message";
import { AuthMessage } from "@/components/auth-message";
import { getAuthToken } from "@/lib/session";
import Link from "next/link";
import { ArrowRight, Check, CircleDollarSign, ClipboardList, PackageCheck, ShoppingBag } from "lucide-react";

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

  const itemCount = order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const isPaid = order.payment?.status === "successful";
  const orderStatus = formatStatus(order.status);
  const paymentStatus = formatPaymentStatus(order.payment?.status);

  return (
    <div className="space-y-5 sm:space-y-6">
      {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
      <section className="overflow-hidden rounded-[2rem] border border-sand-200 bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.55)] sm:rounded-[2.5rem]">
        <div className="bg-ink-950 px-5 py-6 text-white sm:px-8 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">Order {order.orderNumber || order.id}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{statusDescription(order.status, isPaid)}</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">Placed {formatOrderDate(order.createdAt)} · {itemCount} {itemCount === 1 ? "item" : "items"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 sm:text-right">
              <p className="text-xs font-medium text-white/60">Order total</p>
              <p className="mt-1 text-2xl font-semibold">ZMW {Number(order.amount || 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatusStep icon={ClipboardList} label="Order received" complete />
            <StatusStep icon={CircleDollarSign} label="Payment" complete={isPaid} active={!isPaid} />
            <StatusStep icon={PackageCheck} label="Preparing delivery" complete={isDeliveredOrShipped(order.status)} active={isPaid && !isDeliveredOrShipped(order.status)} />
          </div>
        </div>

        <div className="grid divide-y divide-sand-200 lg:grid-cols-[1.25fr_0.75fr] lg:divide-x lg:divide-y-0">
          <section className="p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Your items</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink-950">Order receipt</h3>
              </div>
              <ShoppingBag className="h-5 w-5 text-brand-600" aria-hidden="true" />
            </div>
            <div className="mt-5 space-y-3">
              {order.items?.map((item) => (
                <article key={item.productId} className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-sand-200 bg-sand-50/70 px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink-950">{item.name}</p>
                    <p className="mt-1 text-sm text-ink-900/60">Quantity {item.quantity} · ZMW {Number(item.price).toFixed(2)} each</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-ink-950">ZMW {Number(item.price * item.quantity).toFixed(2)}</p>
                </article>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-sand-200 pt-5 text-sm">
              <span className="font-medium text-ink-900/65">Total paid or due</span>
              <span className="text-lg font-semibold text-ink-950">ZMW {Number(order.amount || 0).toFixed(2)}</span>
            </div>
          </section>

          <aside className="bg-sand-50/60 p-5 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Payment</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink-950">{isPaid ? "Payment confirmed" : "Payment needed"}</h3>
            <div className={`mt-5 rounded-[1.25rem] border p-4 ${paymentStatusClass(order.payment?.status)}`}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/75"><Check className="h-4 w-4" aria-hidden="true" /></span>
                <div><p className="text-sm font-semibold">{paymentStatus}</p><p className="mt-0.5 text-xs opacity-75">{isPaid ? "Your order is ready to be prepared." : "Complete this step to confirm your order."}</p></div>
              </div>
            </div>
            {order.payment?.referenceId ? <p className="mt-4 text-xs leading-5 text-ink-900/60">Payment reference: <span className="font-semibold text-ink-900">{order.payment.referenceId}</span></p> : null}
            {order.payment?.provider ? <p className="mt-1 text-xs leading-5 text-ink-900/60">Payment method: <span className="font-semibold text-ink-900">{formatStatus(order.payment.provider)}</span></p> : null}
            {!isPaid ? (
              <Link href={`/checkout/${order.id}`} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100">
                {order.payment ? "Continue payment" : "Pay for this order"}<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
            <Link href="/orders" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition hover:text-brand-800">Back to all orders <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </aside>
        </div>
      </section>
    </div>
  );
}

function StatusStep({ icon: Icon, label, complete, active }: { icon: typeof Check; label: string; complete?: boolean; active?: boolean }) {
  return <div className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm ${complete ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100" : active ? "border-brand-300/40 bg-brand-400/15 text-white" : "border-white/10 bg-white/5 text-white/45"}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${complete ? "bg-emerald-400 text-emerald-950" : active ? "bg-brand-300 text-ink-950" : "bg-white/10"}`}><Icon className="h-4 w-4" aria-hidden="true" /></span><span className="font-semibold">{label}</span></div>;
}

function formatOrderDate(date?: string) {
  if (!date) return "recently";
  return new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

function statusDescription(status?: string, isPaid = false) {
  if (status === "delivered" || status === "completed") return "Delivered and complete";
  if (status === "shipped" || status === "out-for-delivery" || status === "out_for_delivery") return "Your order is on its way";
  if (status === "cancelled" || status === "failed") return "This order needs attention";
  return isPaid ? "We are preparing your order" : "Finish payment to confirm your order";
}

function isDeliveredOrShipped(status?: string) {
  return ["delivered", "completed", "shipped", "out-for-delivery", "out_for_delivery"].includes(status || "");
}

function formatStatus(status?: string) {
  const value = (status || "not started").replace(/[-_]/g, " ");
  return value.charAt(0).toUpperCase() + value.slice(1);
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
