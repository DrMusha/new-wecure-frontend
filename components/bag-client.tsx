"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthMessage } from "@/components/auth-message";
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

type DeliveryState = {
  address: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
};

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

  function sync(next: CartItem[]) {
    setCart(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wecure-cart-v1", JSON.stringify(next));
    }
  }

  async function handleCheckout() {
    setPending(true);
    setError(null);
    setMessage(null);

    try {
      if (!token) {
        throw new Error("Please sign in before checking out.");
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
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
      <section className="rounded-[2rem] border border-ink-900/10 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink-950 sm:text-2xl">Your bag</h2>
            <p className="mt-1 text-sm text-ink-900/60">{cart.length} items ready for checkout</p>
          </div>
          <Button type="button" variant="ghost" onClick={() => sync([])}>
            Clear bag
          </Button>
        </div>

        <div className="mt-5 space-y-4 sm:mt-6">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-ink-900/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-ink-950">{item.name}</h3>
                  <p className="mt-1 text-sm text-ink-900/60">
                    ZMW {item.price.toFixed(2)} {item.packSize ? `• ${item.packSize}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="secondary" type="button" onClick={() => sync(updateCartItem(item.id, item.quantity - 1))}>
                    -
                  </Button>
                  <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <Button variant="secondary" type="button" onClick={() => sync(updateCartItem(item.id, item.quantity + 1))}>
                    +
                  </Button>
                  <Button variant="ghost" type="button" onClick={() => sync(removeFromCart(item.id))}>
                    Remove
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-ink-900/10 bg-sand-50 p-6 text-sm text-ink-900/65 sm:p-8">
              Your bag is empty. Browse the catalog and add products from the product detail page.
            </div>
          )}
        </div>

        <div className="mt-6 rounded-3xl bg-ink-950 p-4 text-white sm:p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-300 sm:text-sm sm:tracking-[0.22em]">Total</p>
          <p className="mt-2 text-2xl font-semibold sm:text-3xl">ZMW {total.toFixed(2)}</p>
        </div>
      </section>

      <aside className="space-y-6">
        <section className="rounded-[2rem] border border-ink-900/10 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold text-ink-950 sm:text-2xl">Delivery details</h2>
          <div className="mt-5 grid gap-4">
            <Input value={delivery.address} onChange={(e) => setDelivery((prev) => ({ ...prev, address: e.target.value }))} placeholder="Address" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input value={delivery.city} onChange={(e) => setDelivery((prev) => ({ ...prev, city: e.target.value }))} placeholder="City" />
              <Input value={delivery.state} onChange={(e) => setDelivery((prev) => ({ ...prev, state: e.target.value }))} placeholder="State / Province" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input value={delivery.country} onChange={(e) => setDelivery((prev) => ({ ...prev, country: e.target.value }))} placeholder="Country" />
              <Input value={delivery.phoneNumber} onChange={(e) => setDelivery((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="Phone number" />
            </div>
            <Textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} placeholder="Prescription notes or instructions" />
          </div>
        </section>

        <section className="rounded-[2rem] border border-ink-900/10 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold text-ink-950 sm:text-2xl">Checkout</h2>
          <p className="mt-2 text-sm leading-6 text-ink-900/65 sm:leading-7">
            Save your delivery details and place your order when you are ready.
          </p>
          {error ? <div className="mt-4"><AuthMessage tone="error">{error}</AuthMessage></div> : null}
          {message ? <div className="mt-4"><AuthMessage tone="success">{message}</AuthMessage></div> : null}
          <Button className="mt-6 w-full" type="button" onClick={handleCheckout} disabled={pending || cart.length === 0}>
            {pending ? "Placing order..." : "Place order"}
          </Button>
          {!token ? (
            <p className="mt-4 text-sm text-ink-900/60">
              Please <Link href="/auth/login" className="font-medium text-brand-600">sign in</Link> to complete checkout.
            </p>
          ) : null}
        </section>
      </aside>
    </div>
  );
}
