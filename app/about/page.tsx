import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content">
        <PageShell
          eyebrow="About"
          title="About the new frontend."
          description="We will use this page to explain the product direction and trust signals."
        />
      </main>
      <SiteFooter />
    </div>
  );
}
