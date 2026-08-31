import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content">
        <PageShell
          eyebrow="Search"
          title="Search will become API-driven."
          description="This route will later query the products endpoint with server-side filters."
        />
      </main>
      <SiteFooter />
    </div>
  );
}
