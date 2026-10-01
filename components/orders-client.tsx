"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AuthMessage } from "@/components/auth-message";
import { SectionMessage } from "@/components/section-message";
import { getOrders, type Order } from "@/lib/backend";
import { getAuthToken } from "@/lib/session";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 5;

function formatStatus(status?: string) {
  const value = (status || "processing").replace(/-/g, " ");
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function OrdersClient() {
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setToken(getAuthToken());
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getOrders(token)
      .then((data) => {
        setOrders(data);
        setPage(1);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders."))
      .finally(() => setLoading(false));
  }, [token]);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedOrders = useMemo(
    () => orders.slice(startIndex, startIndex + PAGE_SIZE),
    [orders, startIndex],
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  if (!token) {
    return (
      <SectionMessage
        title="Sign in to view your orders"
        description="Please sign in to view your orders."
        action={{ href: "/auth/login?next=/orders", label: "Sign in" }}
      />
    );
  }

  if (loading) {
    return <SectionMessage title="Loading orders" description="Please wait while we fetch your order history." />;
  }

  if (orders.length === 0) {
    return <SectionMessage title="No orders yet" description="Once you place a checkout, the order history will appear here." action={{ href: "/products", label: "Start shopping" }} />;
  }

  function goToPreviousPage() {
    setPage((current) => Math.max(1, current - 1));
  }

  function goToNextPage() {
    setPage((current) => Math.min(totalPages, current + 1));
  }

  return (
    <div className="space-y-4">
      {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}

      <div className="overflow-hidden rounded-[2rem] border border-sand-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-sand-200 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Order history</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink-950 sm:text-2xl">Your recent purchases</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-900/60"><p>Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, orders.length)} of {orders.length}</p><Link href="/products" className="font-semibold text-brand-700 hover:text-brand-800">Shop again</Link></div>
        </div>

        <div className="hidden overflow-x-auto sm:block">
          <table className="min-w-full divide-y divide-slate-200/70">
            <thead className="bg-sand-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.22em] text-ink-900/50">
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="align-top transition hover:bg-sand-50/70">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-ink-950">{order.orderNumber || order.id}</p>
                    <p className="mt-1 text-xs text-ink-900/55">{order.id}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${orderStatusClass(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${paymentStatusClass(order.payment?.status)}`}>
                      {formatPaymentStatus(order.payment?.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-900/70">{order.items?.length || 0} items</td>
                  <td className="px-5 py-4 text-sm font-semibold text-ink-950">
                    ZMW {Number(order.amount || 0).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-900/70">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
                    >
                      Details <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-sand-200 sm:hidden">
          {paginatedOrders.map((order) => (
            <article key={order.id} className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-950">{order.orderNumber || order.id}</p>
                  <p className="mt-1 text-xs text-ink-900/55">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Date unavailable"}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-ink-950">ZMW {Number(order.amount || 0).toFixed(2)}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${orderStatusClass(order.status)}`}>{formatStatus(order.status)}</span>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${paymentStatusClass(order.payment?.status)}`}>{formatPaymentStatus(order.payment?.status)}</span>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{order.items?.length || 0} items</span>
              </div>
              <Link href={`/orders/${order.id}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition hover:text-brand-800">View order details <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-sand-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-900/60">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 sm:flex-none",
                currentPage === 1
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : "border-ink-900/10 bg-white text-ink-900 hover:border-brand-300 hover:text-brand-600",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 sm:flex-none",
                currentPage === totalPages
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : "border-ink-900/10 bg-white text-ink-900 hover:border-brand-300 hover:text-brand-600",
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPaymentStatus(status?: string) {
  if (!status) return "Not started";
  return formatStatus(status);
}
function orderStatusClass(status?: string) {
  switch (status) {
    case "delivered":
    case "completed":
      return "bg-emerald-50 text-emerald-700";
    case "cancelled":
    case "failed":
      return "bg-rose-50 text-rose-700";
    case "out-for-delivery":
    case "shipped":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-brand-50 text-brand-700";
  }
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
