
import { useState } from 'react';
import { Cat, Dog, Bone, SprayCan, Plus, Heart, Menu, X, Crown, Gamepad2, Package, Stethoscope, Shirt, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categories = [
    { icon: Crown, label: 'Cat Food', href: '#' },
    { icon: Gamepad2, label: 'Cat Toys', href: '#' },
    { icon: Package, label: 'Cat Litter', href: '#' },
    { icon: Stethoscope, label: 'Cat Care & Health', href: '#' },
    { icon: Shirt, label: 'Clothing, Beds & Carrier', href: '#' },
    { icon: Gem, label: 'Cat Accessories', href: '#' },
    { icon: Dog, label: 'Dog Food', href: '#' },
    { icon: Plus, label: 'Dog Health & Accessories', href: '#' },
    { icon: Bone, label: 'Rabbit Food & Accessories', href: '#' },
    { icon: SprayCan, label: 'Bird Food & Accessories', href: '#' },
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
                    "flex items-center py-1.5 px-3 text-gray-700 hover:bg-yellow-50 hover:text-meow-green rounded transition-colors text-sm",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? category.label : undefined}
                >
                  <IconComponent size={14} className={cn(
                    "text-meow-green",
                    isCollapsed ? "mr-0" : "mr-2"
                  )} />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-300">
                      {category.label}
                    </span>
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
