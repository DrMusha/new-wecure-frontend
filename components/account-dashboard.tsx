"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LogOut,
  Mail,
  ShoppingBag,
  ShieldCheck,
  Stethoscope,
  UserCircle2,
} from "lucide-react";
import { clearAuthSession, getAuthToken, getAuthUser, type AuthUser } from "@/lib/session";

function getInitials(user: AuthUser | null) {
  const base = (user?.name || user?.email || "Account").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return base.slice(0, 2).toUpperCase();
}

export function AccountDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const currentUser = getAuthUser();
    if (!currentUser) {
      router.replace("/auth/login?next=/account");
      return;
    }

    setUser(currentUser);
    setReady(true);
  }, [router]);

  function handleLogout() {
    clearAuthSession();
    router.replace("/auth/login");
    router.refresh();
  }

  if (!ready || !user) {
    return (
      <div className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-200/70 backdrop-blur sm:p-8">
        <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="h-40 animate-pulse rounded-[1.5rem] bg-slate-100" />
          <div className="h-40 animate-pulse rounded-[1.5rem] bg-slate-100" />
        </div>
      </div>
    );
  }

  const token = getAuthToken();
  const initials = getInitials(user);
  const roleLabel = user.role || "Member";
  const accountItems = [
    {
      href: "/orders",
      title: "Orders",
      description: "Track payment, fulfilment, and delivery progress.",
      icon: ShoppingBag,
    },
    {
      href: "/products",
      title: "Continue shopping",
      description: "Find medicines and essentials for your next order.",
      icon: ArrowRight,
    },
    {
      href: "/medical-card",
      title: "Medical Card",
      description: "View or update your stored medical profile.",
      icon: Stethoscope,
    },
    {
      href: "/bag",
      title: "Shopping Bag",
      description: "Continue where you left off in checkout.",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="space-y-6">
      <section
        id="overview"
        className="rounded-[2rem] border border-sand-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-brand-600 text-base font-bold text-white shadow-lg shadow-brand-200 sm:h-16 sm:w-16 sm:rounded-3xl sm:text-lg">
              {initials}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700 sm:text-xs sm:tracking-[0.24em]">
                Account profile
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                {user.name || "WeCure customer"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-900/60 sm:leading-7">
                Your details are ready for faster checkout, order updates, and your medical card.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>

        <div id="details" className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-sand-200 bg-sand-50 p-4 sm:rounded-[1.75rem] sm:p-5">
            <div className="flex items-center gap-2 text-brand-600">
              <UserCircle2 className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Personal details</p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Name</p>
                <p className="mt-1 font-semibold text-gray-950">{user.name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Email</p>
                <p className="mt-1 font-semibold text-gray-950">{user.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Role</p>
                <p className="mt-1 font-semibold text-gray-950">{roleLabel}</p>
              </div>
            </div>
          </div>

          <div id="session" className="rounded-[1.5rem] border border-brand-100 bg-brand-50/70 p-4 sm:rounded-[1.75rem] sm:p-5">
            <div className="flex items-center gap-2 text-brand-600">
              <ShieldCheck className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Session status</p>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-7 text-gray-700">
              <p>
                You are signed in and can continue shopping, place orders, and manage your medical card.
              </p>
              <div className="rounded-2xl border border-white/80 bg-white/90 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Account access</p>
                <p className="mt-1 font-semibold text-gray-950">{token ? "Signed in securely" : "Sign-in needs attention"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr] lg:items-start lg:gap-6">
        <section id="actions" className="rounded-[2rem] border border-sand-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700 sm:text-xs sm:tracking-[0.24em]">Quick actions</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-ink-950 sm:text-2xl">Keep moving</h2></div>
            <p className="hidden text-sm text-ink-900/55 sm:block">Your most-used shortcuts</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex h-full items-start justify-between gap-3 rounded-2xl border border-sand-200 bg-sand-50 px-4 py-4 transition hover:border-brand-200 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
                >
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-brand-100 sm:h-11 sm:w-11">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-950">{item.title}</p>
                      <p className="text-sm leading-6 text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </Link>
              );
            })}
          </div>
        </section>

        <aside id="help" className="rounded-[2rem] border border-sand-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700 sm:text-xs sm:tracking-[0.24em]">Your account benefits</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-brand-600" />
              <p className="text-sm leading-7 text-gray-600">
                Keeps your profile ready for faster checkout and order updates.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-brand-600" />
              <p className="text-sm leading-7 text-gray-600">
                Gives you a single place to jump to orders, checkout, and medical card management.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
