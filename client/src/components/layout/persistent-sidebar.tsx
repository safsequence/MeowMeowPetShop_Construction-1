import { Crown, Gamepad2, Package, Stethoscope, Shirt, Gem, Plus, Dog, Bone, SprayCan, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { useSidebar } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';

export default function PersistentSidebar() {
  const { isVisible } = useSidebar();

  const categories = [
    { icon: Crown, label: 'Cat Food', href: '/cat-food', hasSubCategories: true },
    { icon: Gamepad2, label: 'Cat Toys', href: '/cat-toys', hasSubCategories: false },
    { icon: Package, label: 'Cat Litter', href: '/cat-litter', hasSubCategories: true },
    { icon: Stethoscope, label: 'Cat Care & Health', href: '/cat-care', hasSubCategories: false },
    { icon: Shirt, label: 'Clothing, Beds & Carrier', href: '/cat-accessories', hasSubCategories: true },
    { icon: Gem, label: 'Cat Accessories', href: '/cat-accessories', hasSubCategories: true },
    { icon: Plus, label: 'Dog Health & Accessories', href: '/dog-accessories', hasSubCategories: true },
    { icon: Dog, label: 'Dog Food', href: '/dog-food', hasSubCategories: true },
    { icon: Bone, label: 'Rabbit Food & Accessories', href: '/rabbit', hasSubCategories: true },
    { icon: SprayCan, label: 'Bird Food & Accessories', href: '/bird', hasSubCategories: true },
  ];

  if (!isVisible) return null;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 mt-[140px] overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[#26732d] flex items-center text-sm">
            Categories
          </h3>
        </div>
        <ul className="space-y-1">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <li key={index}>
                <Link href={category.href}>
                  <div className="flex items-center justify-between py-2 px-3 text-gray-700 hover:bg-[#ffde59]/20 hover:text-[#26732d] rounded transition-colors text-sm cursor-pointer">
                    <div className="flex items-center min-w-0">
                      <IconComponent size={14} className="text-[#26732d] mr-2 flex-shrink-0" />
                      <span className="truncate">{category.label}</span>
                    </div>
                    {category.hasSubCategories && (
                      <ChevronRight size={12} className="text-gray-400 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}