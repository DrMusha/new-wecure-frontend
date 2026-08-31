import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content">
        <PageShell
          eyebrow="Contact"
          title="Talk to the team."
          description="This will later hold the contact and support entry points."
        />
      </main>
      <SiteFooter />
    </div>
  );
}
