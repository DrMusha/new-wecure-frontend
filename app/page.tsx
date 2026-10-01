import { CategoryGrid } from "@/components/category-grid";
import { Hero } from "@/components/hero";
import { FeaturedProducts } from "@/components/featured-products";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { EmergencyBanner } from "@/components/emergency-banner";
import { HomeActions } from "@/components/home-actions";
import { LoyaltyBanner } from "@/components/loyalty-banner";
import { CustomerReviews } from "@/components/customer-reviews";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <EmergencyBanner />
      <main id="content">
        <Hero />
        <HomeActions />
        <CategoryGrid />
        <FeaturedProducts />
        <LoyaltyBanner />
        <CustomerReviews />
      </main>
      <SiteFooter />
    </div>
  );
}
