"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
        description="Orders are protected by the backend token, so we need an authenticated session first."
      />
    );
  }

  if (loading) {
    return <SectionMessage title="Loading orders" description="Please wait while we fetch your order history." />;
  }

  if (orders.length === 0) {
    return <SectionMessage title="No orders yet" description="Once you place a checkout, the order history will appear here." />;
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

      <div className="rounded-[2rem] border border-white/80 bg-white/95 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/70 backdrop-blur">
        <div className="flex flex-col gap-2 border-b border-slate-200/70 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">Order history</p>
            <h3 className="mt-2 text-xl font-semibold text-ink-950">Your recent purchases</h3>
          </div>
          <p className="text-sm text-ink-900/60">
            Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, orders.length)} of {orders.length}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/70">
            <thead className="bg-slate-50/70">
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="align-top">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-ink-950">{order.orderNumber || order.id}</p>
                    <p className="mt-1 text-xs text-ink-900/55">{order.id}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {formatStatus(order.status)}
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
                      className="inline-flex items-center justify-center rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-brand-300 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
                    >
                      View details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-900/60">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100",
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
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100",
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
