
import { useState } from 'react';
import { Cat, Dog, Bone, SprayCan, Plus, Heart, Package, Stethoscope, Shirt, Gem, Crown, Gamepad2 } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/sidebar-context';

export default function NavigationSidebar() {
  const { isVisible, setIsVisible } = useSidebar();
  
  const onClose = () => setIsVisible(false);
  const categories = [
    { icon: Crown, label: 'Cat Food', href: '/cat-food', hasSubCategories: true },
    { icon: Dog, label: 'Dog Food', href: '/dog-food', hasSubCategories: true },
    { icon: Gamepad2, label: 'Cat Toys', href: '/cat-toys', hasSubCategories: false },
    { icon: Package, label: 'Cat Litter', href: '/cat-litter', hasSubCategories: true },
    { icon: Stethoscope, label: 'Cat Care & Health', href: '/cat-care', hasSubCategories: false },
    { icon: Shirt, label: 'Clothing, Beds & Carrier', href: '/cat-accessories', hasSubCategories: true },
    { icon: Gem, label: 'Cat Accessories', href: '/cat-accessories', hasSubCategories: true },
    { icon: Plus, label: 'Dog Health & Accessories', href: '/dog-accessories', hasSubCategories: true },
    { icon: Bone, label: 'Rabbit Food & Accessories', href: '/rabbit', hasSubCategories: true },
    { icon: SprayCan, label: 'Bird Food & Accessories', href: '/bird', hasSubCategories: true },
  ];

  return (
    <>
      {/* Overlay */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-[140px] w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto',
          'min-h-[calc(100vh-140px)]',
          isVisible ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4">
          <div className="mb-4">
            <h3 className="font-bold text-[#26732d] text-lg">Categories</h3>
            <div className="w-12 h-0.5 bg-[#ffde59] mt-2"></div>
          </div>

          <ul className="space-y-1">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <li key={index}>
                  <Link 
                    href={category.href}
                    onClick={onClose}
                  >
                    <div className="flex items-center justify-between py-3 px-4 text-gray-700 hover:bg-[#f0f8ff] hover:text-[#26732d] rounded-lg transition-colors text-sm group cursor-pointer border border-transparent hover:border-[#ffde59]/20">
                      <div className="flex items-center">
                        <IconComponent 
                          size={18} 
                          className="text-[#26732d] mr-3 group-hover:scale-110 transition-transform" 
                        />
                        <span className="font-medium transition-colors">
                          {category.label}
                        </span>
                      </div>
                      {category.hasSubCategories && (
                        <div className="w-1.5 h-1.5 bg-[#ffde59] rounded-full opacity-60"></div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Special Offer Section */}
          <div className="mt-8 bg-gradient-to-br from-[#f0f8ff] to-[#e6f3ff] p-4 rounded-lg border border-[#ffde59]/20">
            <h4 className="font-bold text-[#26732d] mb-2 text-sm">Special Offer!</h4>
            <p className="text-xs text-gray-700 mb-3 leading-relaxed">
              Get <span className="font-bold text-[#26732d]">5%</span> off on your first order
            </p>
            <Link href="/privilege-club" onClick={onClose}>
              <div className="bg-[#ffde59] hover:bg-[#ffd73e] text-[#26732d] px-3 py-2 rounded-md text-xs font-semibold cursor-pointer transition-colors text-center">
                Join Club
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
