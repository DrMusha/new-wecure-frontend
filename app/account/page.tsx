import { Metadata } from "next";
import { AccountDashboard } from "@/components/account-dashboard";
import { AccountNav } from "@/components/account-nav";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "My Account | WeCure",
  description: "View your WeCure profile, orders, and account shortcuts.",
};

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(219,234,254,0.72),transparent_42%),linear-gradient(180deg,#f8fbff_0%,#eff5fb_56%,#ffffff_100%)] text-gray-900">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <PageBreadcrumbs items={[{ label: "Account" }]} />

        <section className="mt-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">My account</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Your account, all in one place.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-900/65 sm:text-base">Manage your profile, review orders, and pick up where you left off with your health essentials.</p>
        </section>

        <div className="mt-8">
          <AccountNav />
        </div>

        <div className="mt-8">
          <AccountDashboard />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
