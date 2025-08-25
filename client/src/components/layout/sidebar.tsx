
import { useState } from 'react';
import { Cat, Dog, Bone, SprayCan, Plus, Heart, Menu, X, Crown, Gamepad2, Package, Stethoscope, Shirt, Gem, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={cn(
      'bg-white shadow-lg min-h-screen transition-all duration-300 ease-in-out',
      'hidden lg:block',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="p-4">
        {/* Toggle Button */}
        <div className="flex justify-between items-center mb-4">
          {!isCollapsed && (
            <h3 className="font-bold text-meow-green">Categories</h3>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hover:bg-gray-100 p-2"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu size={16} /> : <X size={16} />}
          </Button>
        </div>

        {/* Categories List */}
        <ul className="space-y-1">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <li key={index}>
                <a 
                  href={category.href} 
                  className={cn(
                    "flex items-center justify-between py-1.5 px-3 text-gray-700 hover:bg-yellow-50 hover:text-meow-green rounded transition-colors text-sm",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? category.label : undefined}
                >
                  <div className="flex items-center">
                    <IconComponent size={14} className={cn(
                      "text-meow-green",
                      isCollapsed ? "mr-0" : "mr-2"
                    )} />
                    {!isCollapsed && (
                      <span className="transition-opacity duration-300">
                        {category.label}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && category.hasSubCategories && (
                    <ChevronRight size={12} className="text-gray-400" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
