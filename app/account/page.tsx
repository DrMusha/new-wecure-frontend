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
      <main id="content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PageBreadcrumbs items={[{ label: "Account" }]} />

        <div className="max-w-3xl">
          <p className="inline-flex items-center rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700 shadow-sm">
            Account
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
            Your profile and saved account details.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            This section brings together your profile details and quick routes to the parts of WeCure you use most often.
          </p>
        </div>

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
