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
          description="WeCure is committed to a clear, dependable pharmacy shopping experience."
        />
      </main>
      <SiteFooter />
    </div>
  );
}
