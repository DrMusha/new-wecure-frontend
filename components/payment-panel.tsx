"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthMessage } from "@/components/auth-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createPayment,
  getDeliveryDetails,
  getPaymentsForOrder,
  type DeliveryDetails,
  type Payment,
} from "@/lib/backend";
import { getAuthToken, getAuthUser } from "@/lib/session";
import { SectionMessage } from "@/components/section-message";

type PaymentPanelProps = {
  orderId: string;
  amount?: number;
  orderNumber?: string;
};

type PaymentForm = {
  channel: "card" | "mobile_money";
  currency: string;
  accountNumber: string;
  backUrl: string;
  narration: string;
  referenceData: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  country: string;
  address: string;
  zip: string;
  email: string;
};

const emptyForm = (backUrl: string): PaymentForm => ({
  channel: "mobile_money",
  currency: "ZMW",
  accountNumber: "",
  backUrl,
  narration: "WeCure pharmacy payment",
  referenceData: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  city: "",
  country: "Zambia",
  address: "",
  zip: "",
  email: "",
});

export function PaymentPanel({ orderId, amount, orderNumber }: PaymentPanelProps) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [form, setForm] = useState<PaymentForm>(emptyForm(""));
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const nextToken = getAuthToken();
    setToken(nextToken);
    if (typeof window !== "undefined") {
      const nextBackUrl = `${window.location.origin}/orders/${orderId}`;
      setForm(emptyForm(nextBackUrl));
    }
  }, [orderId]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([
      getPaymentsForOrder(token, orderId).catch(() => []),
      getDeliveryDetails(token).catch(() => null),
    ])
      .then(([paymentList, delivery]) => {
        setPayments(paymentList);
        const user = getAuthUser();
        const names = splitName(user?.name || "");
        setForm((prev) => ({
          ...prev,
          firstName: names.firstName || prev.firstName,
          lastName: names.lastName || prev.lastName,
          email: user?.email || prev.email,
          phoneNumber: (delivery as DeliveryDetails | null)?.phoneNumber || prev.phoneNumber,
          city: (delivery as DeliveryDetails | null)?.city || prev.city,
          country: (delivery as DeliveryDetails | null)?.country || prev.country,
          address: (delivery as DeliveryDetails | null)?.address || prev.address,
        }));
      })
      .finally(() => setLoading(false));
  }, [orderId, token]);

  const latestPayment = useMemo(() => payments[0] || null, [payments]);

  async function refreshPayments() {
    if (!token) return;
    setRefreshing(true);
    setError(null);
    try {
      const paymentList = await getPaymentsForOrder(token, orderId);
      setPayments(paymentList);
      setMessage("Payment status refreshed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not refresh payments.");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError("Please sign in to initiate a payment.");
      return;
    }
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const payment = await createPayment(token, {
        orderId,
        channel: form.channel,
        currency: form.currency,
        accountNumber: form.accountNumber,
        email: form.email,
        backUrl: form.backUrl,
        narration: form.narration,
        referenceData: form.referenceData,
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
          city: form.city,
          country: form.country,
          address: form.address,
          zip: form.zip,
          email: form.email,
        },
      });
      setMessage(`Payment ${payment.referenceId || payment.id} initiated.`);
      setPayments((prev) => [payment, ...prev.filter((item) => item.id !== payment.id)]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment initiation failed.");
    } finally {
      setPending(false);
    }
  }

  if (!token) {
    return (
      <SectionMessage
        title="Sign in to pay for this order"
        description="Please sign in to start and track your payment."
      />
    );
  }

  if (loading) {
    return <SectionMessage title="Loading payment details" description="Fetching your current payment status and delivery details." />;
  }

  return (
    <section className="rounded-[2rem] border border-ink-900/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">Payment</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink-950">Initiate or review payment</h2>
          <p className="mt-2 text-sm text-ink-900/60">
            Order {orderNumber || orderId} • {amount ? `ZMW ${Number(amount).toFixed(2)}` : "amount pending"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {latestPayment ? (
            <div className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
              Latest status: <span className="font-semibold">{latestPayment.status || "initiated"}</span>
            </div>
          ) : null}
          <Button type="button" variant="secondary" onClick={refreshPayments} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh status"}
          </Button>
        </div>
      </div>

      {error ? <div className="mt-4"><AuthMessage tone="error">{error}</AuthMessage></div> : null}
      {message ? <div className="mt-4"><AuthMessage tone="success">{message}</AuthMessage></div> : null}

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">Channel</label>
            <select
              value={form.channel}
              onChange={(e) => setForm((prev) => ({ ...prev, channel: e.target.value as PaymentForm["channel"] }))}
              className="h-11 w-full rounded-2xl border border-ink-900/10 bg-white px-4 text-sm text-ink-950 outline-none"
            >
              <option value="mobile_money">Mobile money</option>
              <option value="card">Card</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-900">Account number</label>
            <Input value={form.accountNumber} onChange={(e) => setForm((prev) => ({ ...prev, accountNumber: e.target.value }))} placeholder="Account or short code" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input value={form.firstName} onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))} placeholder="Customer first name" />
          <Input value={form.lastName} onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))} placeholder="Customer last name" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input value={form.phoneNumber} onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="Phone number" />
          <Input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} type="email" placeholder="Email" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} placeholder="City" />
          <Input value={form.country} onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))} placeholder="Country" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} placeholder="Address" />
          <Input value={form.zip} onChange={(e) => setForm((prev) => ({ ...prev, zip: e.target.value }))} placeholder="Zip" />
        </div>
        <Input value={form.currency} onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))} placeholder="Currency" />
        <Input value={form.narration} onChange={(e) => setForm((prev) => ({ ...prev, narration: e.target.value }))} placeholder="Narration" />
        <Input value={form.referenceData} onChange={(e) => setForm((prev) => ({ ...prev, referenceData: e.target.value }))} placeholder="Reference data" />
        <Button type="submit" disabled={pending}>
          {pending ? "Starting payment..." : "Initiate payment"}
        </Button>
      </form>

      <div className="mt-6 space-y-3">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div key={payment.id} className="rounded-2xl bg-sand-50 px-4 py-3 text-sm text-ink-900/75">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-medium text-ink-950">
                  {payment.referenceId || payment.id}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  {payment.status || "initiated"}
                </span>
              </div>
              <p className="mt-1">
                {payment.provider || "lipila"} • {payment.channel || form.channel} • {payment.currency || form.currency}
              </p>
            </div>
          ))
        ) : (
          <SectionMessage
            title="No payment has been created yet"
            description="Use the form above to start the payment flow for this order."
          />
        )}
      </div>
    </section>
  );
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}
