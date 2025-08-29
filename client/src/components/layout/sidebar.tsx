import { useState } from 'react';
import { Cat, Dog, Bone, SprayCan, Plus, Heart, Package, Stethoscope, Shirt, Gem, Crown, Gamepad2, ChevronRight } from 'lucide-react';
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
      {/* Backdrop - Only covers content below header */}
      {isVisible && (
        <div 
          className="fixed left-0 top-[120px] right-0 bottom-0 bg-black bg-opacity-50 z-30" 
          onClick={onClose}
        />
      )}

      {/* Sidebar - Positioned below the fixed header */}
      <div className={cn(
        "fixed left-0 top-[120px] w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 h-[calc(100vh-120px)] overflow-y-auto",
        isVisible ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Categories</h2>
          <nav className="space-y-1">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link 
                  key={category.label} 
                  href={category.href}
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#26732d] rounded-lg transition-colors group"
                  onClick={onClose}
                >
                  <IconComponent className="w-5 h-5 mr-3 text-gray-500 group-hover:text-[#26732d]" />
                  <span className="font-medium">{category.label}</span>
                  {category.hasSubCategories && (
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-[#26732d]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}