import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MedicalCardClient } from "@/components/medical-card-client";
import { AccountNav } from "@/components/account-nav";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";

export const metadata = {
  title: "Medical Card | WeCure",
  description: "Create and manage your medical card and health logs.",
};

export default function MedicalCardPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Medical Card" }]} />

        <div className="mt-6">
          <AccountNav />
        </div>

        <section className="mt-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Medical card</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Your health details, kept together.</h1>
          <p className="mt-3 text-sm leading-7 text-ink-900/65 sm:text-base">Keep a private profile ready for more informed pharmacy care and track your health readings when you need to.</p>
        </section>
        <div className="mt-8 sm:mt-10">
          <MedicalCardClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
