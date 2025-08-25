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
import { cn } from '@/lib/utils';
import { useSidebar } from "@/contexts/sidebar-context";

export default function Home() {
  const { isVisible: sidebarVisible } = useSidebar();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <PersistentSidebar />

      <main className={`flex-1 transition-all duration-300 ${sidebarVisible ? 'ml-64 w-[calc(100%-16rem)]' : 'ml-0 w-full'}`}>
        <div className="space-y-8 md:space-y-12">
          <HeroBanner />
          <div className="px-4 lg:px-6">
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
        </div>
      </main>

      <div className={`transition-all duration-300 ${sidebarVisible ? 'ml-64 w-[calc(100%-16rem)]' : 'ml-0 w-full'}`}>
        <Footer />
      </div>
    </div>
  );
}