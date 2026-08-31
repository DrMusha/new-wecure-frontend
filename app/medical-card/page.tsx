import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MedicalCardClient } from "@/components/medical-card-client";
import { AccountNav } from "@/components/account-nav";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { SectionHeading } from "@/components/section-heading";

export const metadata = {
  title: "Medical Card | WeCure",
  description: "Create and manage your medical card and health logs.",
};

export default function MedicalCardPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Medical Card" }]} />

        <div className="mt-6">
          <AccountNav />
        </div>

        <div className="mt-8">
          <SectionHeading
            eyebrow="Medical Card"
            title="Your clinical profile and health logs."
            description="Keep your health information and logs in one place."
          />
        </div>
        <div className="mt-10">
          <MedicalCardClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
