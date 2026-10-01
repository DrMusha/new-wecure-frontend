import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content">
        <PageShell
          eyebrow="Privacy"
          title="Privacy policy."
          description="Your account, order, and medical information deserve careful handling and clear communication."
        />
      </main>
      <SiteFooter />
    </div>
  );
}
