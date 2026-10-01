"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, ShieldCheck, Smartphone, TriangleAlert } from "lucide-react";
import { AuthMessage } from "@/components/auth-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createPayment,
  getDeliveryDetails,
  getPaymentsForOrder,
  subscribeToPaymentStatus,
  queuePaymentSync,
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

type NetworkBadge = {
  name: string;
  className: string;
  iconClassName: string;
};

const emptyForm = (backUrl: string): PaymentForm => ({
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

const supportedNetworks: NetworkBadge[] = [
  { name: "MTN", className: "bg-yellow-300 text-black", iconClassName: "bg-black/10 text-black" },
  { name: "Airtel", className: "bg-red-600 text-white", iconClassName: "bg-white/15 text-white" },
  { name: "Zamtel", className: "bg-green-600 text-white", iconClassName: "bg-white/15 text-white" },
];

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
  const stopStatusStream = useRef<(() => void) | null>(null);
  const activePaymentID = useRef<string | null>(null);

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
        const phoneNumber = (delivery as DeliveryDetails | null)?.phoneNumber || "";
        setForm((prev) => ({
          ...prev,
          firstName: names.firstName || prev.firstName,
          lastName: names.lastName || prev.lastName,
          email: user?.email || prev.email,
          phoneNumber: phoneNumber || prev.phoneNumber,
          accountNumber: phoneNumber || prev.accountNumber,
          city: (delivery as DeliveryDetails | null)?.city || prev.city,
          country: (delivery as DeliveryDetails | null)?.country || prev.country,
          address: (delivery as DeliveryDetails | null)?.address || prev.address,
        }));
      })
      .finally(() => setLoading(false));
  }, [orderId, token]);

  const latestPayment = useMemo(() => payments[0] || null, [payments]);
  const hasStartedPayment = pending || Boolean(latestPayment);
  const isProcessing = pending || latestPayment?.status === "initiated" || latestPayment?.status === "pending";
  const isSuccessful = latestPayment?.status === "successful";

  function trackPayment(payment: Payment) {
    if (!token || activePaymentID.current === payment.id) return;
    stopStatusStream.current?.();
    activePaymentID.current = payment.id;
    stopStatusStream.current = subscribeToPaymentStatus(
      token,
      payment.id,
      (updated) => {
        setError(null);
        setPayments((previous) => [updated, ...previous.filter((item) => item.id !== updated.id)]);
        window.dispatchEvent(new CustomEvent("wecure:payment-status", {
          detail: { orderId, payment: updated },
        }));
        if (updated.status === "successful") {
          activePaymentID.current = null;
          setPending(false);
          setMessage("Payment successful. Your order is now being processed.");
          router.refresh();
        } else if (updated.status === "failed") {
          activePaymentID.current = null;
          setPending(false);
          setError(updated.failureMessage || "Payment failed. Please check your details and try again.");
        } else {
          setMessage("Payment request sent. Waiting for confirmation.");
        }
      },
      (streamError) => {
        setError(streamError.message);
      },
    );
  }

  useEffect(() => {
    if (!latestPayment || !token) return;
    if (latestPayment.status === "initiated" || latestPayment.status === "pending") {
      trackPayment(latestPayment);
    }
    return () => {
      stopStatusStream.current?.();
      activePaymentID.current = null;
    };
  }, [latestPayment?.id, latestPayment?.status, token]);

  async function refreshPayments() {
    if (!token) return;
    setRefreshing(true);
    setError(null);
    try {
      const paymentList = await getPaymentsForOrder(token, orderId);
      setPayments(paymentList);
      const pendingPayment = paymentList.find((payment) =>
        payment.status === "initiated" || payment.status === "pending",
      );
      if (pendingPayment) {
        await queuePaymentSync(token, pendingPayment.id);
        stopStatusStream.current?.();
        activePaymentID.current = null;
        trackPayment(pendingPayment);
      }
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

    const paymentNumber = form.accountNumber.trim() || form.phoneNumber.trim();
    if (!paymentNumber) {
      setError("Enter the mobile money number you want to pay with.");
      return;
    }

    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const payment = await createPayment(token, {
        orderId,
        channel: "mobile_money",
        currency: form.currency,
        accountNumber: paymentNumber,
        email: form.email,
        backUrl: form.backUrl,
        narration: form.narration,
        referenceData: form.referenceData || orderNumber || orderId,
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber || paymentNumber,
          city: form.city,
          country: form.country,
          address: form.address,
          zip: form.zip,
          email: form.email,
        },
      });
      setMessage(`Payment ${payment.referenceId || payment.id} initiated.`);
      setPayments((prev) => [payment, ...prev.filter((item) => item.id !== payment.id)]);
      trackPayment(payment);
    } catch (err) {
      setPending(false);
      setError(err instanceof Error ? err.message : "Payment initiation failed.");
    }
  }

  if (!token) {
    return (
      <SectionMessage
        title="Sign in to pay for this order"
        description="Please sign in to start and track your payment."
        action={{ href: `/auth/login?next=/checkout/${orderId}`, label: "Sign in" }}
      />
    );
  }

  if (loading) {
    return <SectionMessage title="Loading payment details" description="Fetching your current payment status and delivery details." />;
  }

  return (
    <section className="rounded-[1.5rem] border border-white/80 bg-white p-5 pb-28 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.55)] sm:rounded-[2rem] sm:p-6 sm:pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Secure mobile money
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-ink-950">Pay with your phone</h2>
          <p className="mt-2 text-sm leading-6 text-ink-900/60">
            Enter one mobile money number. We detect the network, send a prompt to your phone, and confirm the result here.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={refreshPayments} disabled={refreshing || pending} className="self-start px-4 py-2.5">
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <PaymentStatusWidget payment={latestPayment} pending={pending} />
      {!isSuccessful && !hasStartedPayment ? (
        <ol className="mt-5 grid gap-2 rounded-2xl bg-sand-50 p-4 text-sm text-ink-900/70 sm:grid-cols-3">
          <li><span className="mr-2 font-semibold text-brand-700">1.</span>Enter your number</li>
          <li><span className="mr-2 font-semibold text-brand-700">2.</span>Approve the prompt</li>
          <li><span className="mr-2 font-semibold text-brand-700">3.</span>Wait for confirmation</li>
        </ol>
      ) : null}
      {error ? <div className="mt-4"><AuthMessage tone="error">{error}</AuthMessage></div> : null}
      {message && !error ? <div className="mt-4"><AuthMessage tone="success">{message}</AuthMessage></div> : null}

      {!isSuccessful ? (
        <form id="mobile-money-form" className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          {!hasStartedPayment ? <NetworkBadges /> : null}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink-900">Mobile money number</label>
            <Input
              value={form.accountNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, accountNumber: e.target.value, phoneNumber: e.target.value }))}
              placeholder="0977 000 000"
              inputMode="tel"
              autoComplete="tel"
              disabled={isProcessing}
              required
              className="h-14 rounded-2xl border-sand-200 bg-sand-50 text-base shadow-inner shadow-slate-200/30 focus:bg-white"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input value={form.firstName} onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))} placeholder="First name" disabled={isProcessing} className="h-12 border-sand-200 bg-white" />
            <Input value={form.lastName} onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))} placeholder="Last name" disabled={isProcessing} className="h-12 border-sand-200 bg-white" />
          </div>
          <Input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} type="email" placeholder="Email" disabled={isProcessing} className="h-12 border-sand-200 bg-white" />
          <p className="text-xs leading-5 text-ink-900/55">A mobile-money prompt should appear after you send the request. If it does not, check the number and try again.</p>
          <Button type="submit" disabled={isProcessing} className="hidden sm:inline-flex">
            {isProcessing ? "Awaiting confirmation..." : "Send payment request"}
          </Button>
        </form>
      ) : null}

      {!isSuccessful ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-white/95 px-4 py-3 shadow-[0_-18px_50px_-34px_rgba(15,23,42,0.65)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-md items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-ink-900/55">Total</p>
              <p className="truncate text-lg font-semibold text-ink-950">ZMW {Number(amount || 0).toFixed(2)}</p>
            </div>
            <Button type="submit" form="mobile-money-form" disabled={isProcessing} className="h-12 shrink-0 px-4">
              {isProcessing ? "Waiting" : "Pay now"}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function NetworkBadges() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {supportedNetworks.map((network) => (
        <div key={network.name} className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl px-2 py-3 text-center text-xs font-black uppercase shadow-sm ${network.className}`}>
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${network.iconClassName}`}>
            <Smartphone className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">{network.name}</span>
        </div>
      ))}
    </div>
  );
}

function PaymentStatusWidget({ payment, pending }: { payment: Payment | null; pending: boolean }) {
  const status = payment?.status || (pending ? "initiated" : "not_started");

  if (status === "successful") {
    return (
      <div className="mt-6 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 px-5 py-6 text-center text-emerald-800 shadow-sm" role="status">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-emerald-600 shadow-[0_18px_40px_-24px_rgba(5,150,105,0.8)]">
          <CheckCircle2 className="h-12 w-12" aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Payment status</p>
        <h3 className="mt-2 text-3xl font-semibold text-emerald-950">Successful</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-emerald-700">Your payment has been confirmed and the order is now being processed.</p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <a href="/orders" className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">View my orders</a>
          <a href="/products" className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100">Continue shopping</a>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mt-6 rounded-[1.5rem] border border-rose-100 bg-rose-50 px-5 py-6 text-center text-rose-800 shadow-sm" role="status">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-rose-600 shadow-[0_18px_40px_-24px_rgba(225,29,72,0.8)]">
          <TriangleAlert className="h-11 w-11" aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Payment status</p>
        <h3 className="mt-2 text-3xl font-semibold text-rose-950">Failed</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-rose-700">Check the number and your available balance, then send a new payment request when you are ready.</p>
      </div>
    );
  }

  if (status === "initiated" || status === "pending") {
    return (
      <div className="mt-6 rounded-[1.5rem] border border-amber-100 bg-amber-50 px-5 py-6 text-center text-amber-800 shadow-sm" role="status">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-amber-600 shadow-[0_18px_40px_-24px_rgba(217,119,6,0.8)]">
          <LoaderCircle className="h-12 w-12 animate-spin" aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Payment status</p>
        <h3 className="mt-2 text-3xl font-semibold text-amber-950">Pending</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-amber-700">Awaiting final confirmation. Approve the mobile money prompt if it appears.</p>
        {payment?.referenceId ? <p className="mt-3 text-xs font-semibold text-amber-800">Reference: {payment.referenceId}</p> : null}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-[1.5rem] border border-brand-100 bg-brand-50 px-5 py-6 text-center text-brand-800 shadow-sm" role="status">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-brand-600 shadow-[0_18px_40px_-24px_rgba(37,99,235,0.7)]">
        <ShieldCheck className="h-11 w-11" aria-hidden="true" />
      </span>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Payment status</p>
      <h3 className="mt-2 text-3xl font-semibold text-ink-950">Ready</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-brand-700">Enter your mobile money number to start the payment request.</p>
    </div>
  );
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}
