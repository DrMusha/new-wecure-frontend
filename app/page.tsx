import { CategoryGrid } from "@/components/category-grid";
import { Hero } from "@/components/hero";
import { FeaturedProducts } from "@/components/featured-products";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main id="content">
        <Hero />
        <CategoryGrid />
        <FeaturedProducts />
      </main>
      <SiteFooter />
    </div>
  );
}
