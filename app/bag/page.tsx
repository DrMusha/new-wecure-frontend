import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BagClient } from "@/components/bag-client";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { CheckoutSteps } from "@/components/checkout-steps";

export const metadata = {
  title: "Bag | WeCure",
  description: "Review your bag and place your order.",
};

export default function BagPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Bag" }]} />

        <SectionHeading
          eyebrow="Bag"
          title="Review your items and complete checkout."
          description="Confirm your items and delivery details, then pay securely by mobile money."
        />
        <div className="mt-8 max-w-3xl"><CheckoutSteps current="bag" /></div>
        <div className="mt-8">
          <BagClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
