"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserCircle2 } from "lucide-react";
import { clearAuthSession, getAuthUser, type AuthUser } from "@/lib/session";

export function AuthStatus() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getAuthUser());
    setReady(true);
  }, []);

  function handleLogout() {
    clearAuthSession();
    setUser(null);
    router.push("/auth/login");
    router.refresh();
  }

  if (!ready || !user) {
      return (
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm font-medium text-ink-800 transition hover:border-brand-300 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
      >
        <UserCircle2 className="h-4 w-4" />
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") ? (
        <Link
          href="/admin/payments"
          className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 transition hover:border-brand-300 hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
        >
          Admin
        </Link>
      ) : null}
      <Link
        href="/account"
        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      >
        <UserCircle2 className="h-4 w-4" />
        {user.name || user.email || "Account"}
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm font-medium text-ink-800 transition hover:border-brand-300 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
