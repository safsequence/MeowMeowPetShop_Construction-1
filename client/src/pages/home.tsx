import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PersistentSidebar from "@/components/layout/persistent-sidebar";
import HeroBanner from "@/components/sections/hero-banner";
import CategoriesGrid from "@/components/sections/categories-grid";
import FlashSale from "@/components/sections/flash-sale";
import BestsellersCats from "@/components/sections/bestsellers-cats";
import BestsellersDogs from "@/components/sections/bestsellers-dogs";
import RepackFood from "@/components/sections/repack-food";
import FeaturedBrands from "@/components/sections/featured-brands";
import NewlyLaunched from "@/components/sections/newly-launched";
import MembershipBanner from "@/components/sections/membership-banner";
import BlogPreview from "@/components/sections/blog-preview";
import Testimonials from "@/components/sections/testimonials";
import { useSidebar } from "@/contexts/sidebar-context";

export default function Home() {
  const { isVisible: sidebarVisible, toggle: toggleSidebar } = useSidebar();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PersistentSidebar />

      {/* Backdrop overlay when sidebar is open */}
      {sidebarVisible && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content that shrinks when sidebar opens */}
      <main className={`pt-24 transition-all duration-300 ${sidebarVisible ? 'ml-64' : 'ml-0'}`}>
        <HeroBanner />
        <div className="px-4 lg:px-6 space-y-8 md:space-y-12">
          <CategoriesGrid />
          <FlashSale />
          <BestsellersCats />
          <BestsellersDogs />
          <RepackFood />
          <FeaturedBrands />
          <NewlyLaunched />
          <MembershipBanner />
          <BlogPreview />
          <Testimonials />
        </div>
      </main>

      {/* Footer also shrinks with sidebar */}
      <div className={`transition-all duration-300 ${sidebarVisible ? 'ml-64' : 'ml-0'}`}>
        <Footer />
      </div>
    </div>
  );
}