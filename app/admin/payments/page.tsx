import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SectionHeading } from "@/components/section-heading";
import { AdminPaymentReconcile } from "@/components/admin-payment-reconcile";

export const metadata = {
  title: "Admin Payments | WeCure",
  description: "Review and reconcile payment updates.",
};

export default function AdminPaymentsPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Admin"
          title="Payment reconciliation"
          description="Queue a sync when a payment needs provider reconciliation."
        />
        <div className="mt-10">
          <AdminPaymentReconcile />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
