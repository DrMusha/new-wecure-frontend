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
  Users,
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
      <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
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
      description: "Review your recent purchases and checkout history.",
      icon: Users,
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
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section
        id="overview"
        className="rounded-[2.5rem] border border-white/80 bg-white/95 p-6 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/70 backdrop-blur sm:p-8"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500 text-lg font-bold text-white shadow-lg shadow-blue-200">
              {initials}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                Account profile
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
                {user.name || "WeCure customer"}
              </h2>
              <p className="mt-2 text-sm leading-7 text-gray-500">
                Your profile information is stored from the login session and ready to use across checkout, orders, and your medical card.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm font-medium text-ink-800 transition hover:border-brand-300 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>

        <div id="details" className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-blue-600">
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
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">User ID</p>
                <p className="mt-1 break-all font-semibold text-gray-950">{user.id}</p>
              </div>
            </div>
          </div>

          <div id="session" className="rounded-[1.75rem] border border-slate-200/70 bg-blue-50/70 p-5">
            <div className="flex items-center gap-2 text-blue-600">
              <ShieldCheck className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Session status</p>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-7 text-gray-700">
              <p>
                You are signed in and can continue shopping, place orders, and manage your medical card.
              </p>
              <div className="rounded-2xl border border-white/80 bg-white/90 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Access token
                </p>
                <p className="mt-1 font-semibold text-gray-950">
                  {token ? "Stored locally for authenticated requests" : "No token found"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div id="actions" className="rounded-[2.5rem] border border-white/80 bg-white/95 p-6 shadow-sm ring-1 ring-slate-200/70 backdrop-blur sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">Quick actions</p>
          <div className="mt-5 space-y-3">
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4 transition hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-950">{item.title}</p>
                      <p className="text-sm leading-6 text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                </Link>
              );
            })}
          </div>
        </div>

        <div id="help" className="rounded-[2.5rem] border border-white/80 bg-white/95 p-6 shadow-sm ring-1 ring-slate-200/70 backdrop-blur sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">What this profile does</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-blue-600" />
              <p className="text-sm leading-7 text-gray-600">
                Keeps your identity visible in the app so you can trust where your orders and health data are going.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600" />
              <p className="text-sm leading-7 text-gray-600">
                Gives you a single place to jump to orders, checkout, and medical card management.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
