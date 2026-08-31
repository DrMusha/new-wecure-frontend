import type { Product } from "@/lib/backend";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  images?: string[];
  packSize?: string;
  quantity: number;
};

const CART_KEY = "wecure-cart-v1";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const value = window.localStorage.getItem(CART_KEY);
  if (!value) return [];
  try {
    return JSON.parse(value) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(product: Product, quantity = 1) {
  const cart = getCart();
  const index = cart.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    cart[index] = {
      ...cart[index],
      quantity: cart[index].quantity + quantity,
    };
  } else {
    cart.unshift({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      packSize: product.packSize,
      quantity,
    });
  }
  saveCart(cart);
  return cart;
}

export function updateCartItem(id: string, quantity: number) {
  const cart = getCart()
    .map((item) => (item.id === id ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  saveCart(cart);
  return cart;
}

export function removeFromCart(id: string) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
}
