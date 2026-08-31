import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content">
        <PageShell
          eyebrow="Terms"
          title="Terms and conditions."
          description="Legal content will be added as the new frontend matures."
        />
      </main>
      <SiteFooter />
    </div>
  );
}
