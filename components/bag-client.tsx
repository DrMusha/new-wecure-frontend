"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthMessage } from "@/components/auth-message";
import { CheckoutSteps } from "@/components/checkout-steps";
import {
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
  type CartItem,
} from "@/lib/cart";
import {
  createOrder,
  getDeliveryDetails,
  saveDeliveryDetails,
} from "@/lib/backend";
import { getAuthToken, getAuthUser } from "@/lib/session";
import { ArrowRight, CreditCard, LocateFixed, MapPin, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";

type DeliveryState = {
  address: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
};

type ActiveCheckoutStep = "bag" | "delivery" | "payment";

const emptyDelivery: DeliveryState = {
  address: "",
  city: "",
  state: "",
  country: "Zambia",
  phoneNumber: "",
};

export function BagClient() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<DeliveryState>(emptyDelivery);
  const [prescription, setPrescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<ActiveCheckoutStep>("bag");

  useEffect(() => {
    setCart(getCart());
    setToken(getAuthToken());

    const savedUser = getAuthUser();
    if (savedUser?.email) {
      setMessage(`Signed in as ${savedUser.email}`);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    getDeliveryDetails(token)
      .then((details) =>
        setDelivery({
          address: details.address || "",
          city: details.city || "",
          state: details.state || "",
          country: details.country || "Zambia",
          phoneNumber: details.phoneNumber || "",
        }),
      )
      .catch(() => undefined);
  }, [token]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  function sync(next: CartItem[]) {
    setCart(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wecure-cart-v1", JSON.stringify(next));
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Location services are not supported by this browser. Please enter your address manually.");
      return;
    }

    setLocationLoading(true);
    setLocationMessage(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const locationReference = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
        setDelivery((current) => ({
          ...current,
          address: current.address.trim() ? current.address : `GPS location: ${locationReference}`,
        }));
        setLocationMessage(`Location found: ${locationReference}. Add a landmark if needed.`);
        setLocationLoading(false);
      },
      (locationError) => {
        const errorMessage = locationError.code === locationError.PERMISSION_DENIED
          ? "Location access was not allowed. Please enter your address manually."
          : "We could not determine your location. Please try again or enter your address manually.";
        setLocationMessage(errorMessage);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  function continueToDelivery() {
    if (cart.length === 0) {
      setError("Your bag is empty. Add a product before continuing to delivery.");
      return;
    }
    setError(null);
    setActiveStep("delivery");
  }

  function continueToPayment() {
    if (!delivery.address.trim() || !delivery.city.trim() || !delivery.state.trim() || !delivery.country.trim() || !delivery.phoneNumber.trim()) {
      setError("Complete your delivery address, city, province, country, and mobile number before continuing.");
      return;
    }
    setError(null);
    setActiveStep("payment");
  }

  async function handleCheckout() {
    setPending(true);
    setError(null);
    setMessage(null);

    try {
      if (cart.length === 0) {
        throw new Error("Your bag is empty. Add a product before continuing to checkout.");
      }
      if (!token) {
        router.push("/auth/login?next=/bag");
        return;
      }

      await saveDeliveryDetails(token, delivery);
      const order = await createOrder(token, {
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        prescription,
      });
      clearCart();
      setCart([]);
      setMessage(`Order ${order.orderNumber || order.id} created successfully.`);
      router.push(`/checkout/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CheckoutSteps current={activeStep} />

      {activeStep === "bag" ? (
      <section className="relative rounded-[2rem] border border-sand-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="pr-24 sm:pr-32">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Step 1 · Bag</p>
            <h2 className="text-xl font-semibold text-ink-950 sm:text-2xl">Your bag</h2>
            <p className="mt-1 text-sm text-ink-900/60">{itemCount} {itemCount === 1 ? "item" : "items"} ready for checkout</p>
          </div>
          <button type="button" onClick={() => sync([])} disabled={cart.length === 0} className="absolute right-4 top-4 inline-flex h-10 w-fit items-center justify-center rounded-full border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100 sm:right-6 sm:top-6">
            Clear all
          </button>
        </div>

        <div className="mt-5 space-y-4 sm:mt-6">
          {cart.length > 0 ? (
            cart.map((item) => (
              <article key={item.id} className="flex gap-3 rounded-[1.5rem] border border-sand-200 bg-sand-50/60 p-3 sm:gap-4 sm:p-4">
                <Link href={`/products/${item.id}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white sm:h-24 sm:w-24" aria-label={`View ${item.name}`}>
                  <Image src={item.images?.[0] || "/assets/product-placeholder.svg"} alt="" fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/products/${item.id}`} className="line-clamp-2 text-sm font-semibold text-ink-950 transition hover:text-brand-700 sm:text-base">{item.name}</Link>
                      <p className="mt-1 text-xs text-ink-900/55 sm:text-sm">ZMW {item.price.toFixed(2)}{item.packSize ? ` · ${item.packSize}` : ""}</p>
                    </div>
                    <p className="shrink-0 text-xs font-bold text-ink-950 sm:text-sm">ZMW {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                    <div className="inline-flex items-center rounded-full border border-sand-200 bg-white p-1 shadow-sm" aria-label={`Quantity for ${item.name}`}>
                      <button type="button" onClick={() => sync(updateCartItem(item.id, item.quantity - 1))} aria-label={`Remove one ${item.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-900 transition hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"><Minus className="h-3.5 w-3.5" aria-hidden="true" /></button>
                      <span className="min-w-8 text-center text-sm font-semibold text-ink-950" aria-live="polite">{item.quantity}</span>
                      <button type="button" onClick={() => sync(updateCartItem(item.id, item.quantity + 1))} aria-label={`Add one ${item.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-900 transition hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"><Plus className="h-3.5 w-3.5" aria-hidden="true" /></button>
                    </div>
                    <button type="button" onClick={() => sync(removeFromCart(item.id))} className="inline-flex h-9 items-center gap-1.5 rounded-full px-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 hover:text-rose-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"><Trash2 className="h-3.5 w-3.5" aria-hidden="true" />Remove</button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-ink-900/10 bg-sand-50 p-6 text-sm text-ink-900/65 sm:p-8">
              <ShoppingBag className="h-6 w-6 text-brand-600" aria-hidden="true" />
              <p className="mt-3">Your bag is empty. Find the medicines and essentials you need, then return here to check out.</p>
              <Link href="/products" className="mt-4 inline-flex rounded-full bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">Browse products</Link>
            </div>
          )}
        </div>

        <div className="mt-5 rounded-[1.5rem] bg-ink-950 p-5 text-white sm:mt-6 sm:p-6">
          <div className="flex items-center justify-between gap-4 text-sm text-white/65"><span>Order subtotal</span><span>{itemCount} {itemCount === 1 ? "item" : "items"}</span></div>
          <div className="mt-2 flex flex-col items-start gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4"><p className="text-2xl font-semibold sm:text-3xl">ZMW {total.toFixed(2)}</p><p className="text-xs text-white/60">Delivery confirmed at checkout</p></div>
        </div>
        <Button className="mt-5 h-14 w-full rounded-full text-base shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 sm:mt-6" type="button" onClick={continueToDelivery} disabled={cart.length === 0}>
          Continue to delivery <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </section>
      ) : null}

      {activeStep === "delivery" ? (
        <section className="rounded-[2rem] border border-sand-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><MapPin className="h-5 w-5" /></span>
            <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Step 2 · Delivery</p><h2 className="mt-1 text-xl font-semibold text-ink-950 sm:text-2xl">Delivery details</h2><p className="mt-1 text-sm text-ink-900/60">We’ll save these for your next order.</p></div>
          </div>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="delivery-address" className="text-sm font-medium text-ink-900">Delivery address</label>
                <button type="button" onClick={useCurrentLocation} disabled={locationLoading} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"><LocateFixed className="h-3.5 w-3.5" aria-hidden="true" />{locationLoading ? "Finding location..." : "Use current location"}</button>
              </div>
              <Input id="delivery-address" value={delivery.address} onChange={(e) => setDelivery((prev) => ({ ...prev, address: e.target.value }))} placeholder="Street, area, or landmark" required />
              {locationMessage ? <p className="text-xs leading-5 text-ink-900/60" role="status">{locationMessage}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink-900"><span>City</span><Input value={delivery.city} onChange={(e) => setDelivery((prev) => ({ ...prev, city: e.target.value }))} placeholder="e.g. Lusaka" required /></label>
              <label className="grid gap-2 text-sm font-medium text-ink-900"><span>Province</span><Input value={delivery.state} onChange={(e) => setDelivery((prev) => ({ ...prev, state: e.target.value }))} placeholder="Province" required /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink-900"><span>Country</span><Input value={delivery.country} onChange={(e) => setDelivery((prev) => ({ ...prev, country: e.target.value }))} placeholder="Country" required /></label>
              <label className="grid gap-2 text-sm font-medium text-ink-900"><span>Mobile number</span><Input value={delivery.phoneNumber} onChange={(e) => setDelivery((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="0977 000 000" inputMode="tel" required /></label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-ink-900"><span>Prescription notes <span className="font-normal text-ink-900/50">(optional)</span></span><Textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} placeholder="Add any instructions for the pharmacy" /></label>
          </div>
          {error ? <div className="mt-4"><AuthMessage tone="error">{error}</AuthMessage></div> : null}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="secondary" onClick={() => { setError(null); setActiveStep("bag"); }} className="h-12 rounded-full">Back to bag</Button>
            <Button type="button" onClick={continueToPayment} className="h-12 rounded-full">Continue to payment <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Button>
          </div>
        </section>
      ) : null}

      {activeStep === "payment" ? (
        <section className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_top_right,rgba(191,219,254,0.7),transparent_36%),linear-gradient(135deg,#eff6ff_0%,#ffffff_75%)] p-5 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.5)] sm:p-7">
          <div className="relative flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm"><CreditCard className="h-5 w-5" aria-hidden="true" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Step 3 · Payment</p>
              <h2 className="mt-1 text-xl font-semibold text-ink-950 sm:text-2xl">Ready to pay?</h2>
              <p className="mt-2 text-sm leading-6 text-ink-900/65">Confirm your order, then continue to secure mobile-money payment.</p>
            </div>
          </div>

          <div className="relative mt-6 rounded-[1.5rem] border border-white/90 bg-white/85 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4 text-sm text-ink-900/60"><span>Order summary</span><span>{itemCount} {itemCount === 1 ? "item" : "items"}</span></div>
            <div className="mt-2 flex items-end justify-between gap-4"><p className="text-2xl font-bold tracking-tight text-ink-950">ZMW {total.toFixed(2)}</p><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Delivery details ready</span></div>
          </div>

          {error ? <div className="mt-4"><AuthMessage tone="error">{error}</AuthMessage></div> : null}
          {message ? <div className="mt-4"><AuthMessage tone="success">{message}</AuthMessage></div> : null}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="secondary" onClick={() => { setError(null); setActiveStep("delivery"); }} className="h-14 rounded-full">Back to delivery</Button>
            <Button className="h-14 rounded-full text-base shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200" type="button" onClick={handleCheckout} disabled={pending || cart.length === 0}>
              {pending ? "Creating your order..." : token ? "Continue to payment" : "Sign in to continue"}
              {!pending ? <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /> : null}
            </Button>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-ink-900/60"><ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />Secure mobile-money checkout</p>
          {!token ? (
            <p className="mt-4 text-sm text-ink-900/60">
              Sign in before continuing so your delivery and order history are saved securely.
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
