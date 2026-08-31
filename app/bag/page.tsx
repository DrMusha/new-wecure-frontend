import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BagClient } from "@/components/bag-client";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { SectionHeading } from "@/components/section-heading";

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
          description="Add your delivery details before placing your order."
        />
        <div className="mt-10">
          <BagClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
