import { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingCart, Phone, Truck, Shield, Facebook, Instagram, LogOut, Menu, ChevronDown, LogIn, Speaker } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';
import { useSidebar } from '@/contexts/sidebar-context';
import { Link, useLocation } from 'wouter';
import { searchProducts, type SearchableProduct } from '@/lib/search-data';
import { useQuery } from '@tanstack/react-query';
const logoPath = '/logo.png';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchableProduct[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { state: cartState } = useCart();
  const { toggle: toggleSidebar } = useSidebar();
  const [, setLocation] = useLocation();

  // Fetch current announcement
  const { data: announcements } = useQuery({
    queryKey: ['/api/announcements'],
    queryFn: async () => {
      const response = await fetch('/api/announcements');
      if (!response.ok) throw new Error('Failed to fetch announcements');
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const currentAnnouncement = announcements?.[0];

  // Function to parse bold text formatting
  const parseAnnouncementText = (text: string) => {
    if (!text) return text;

    // Replace **text** with bold
    let parsed = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Replace *text* with bold
    parsed = parsed.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');

    return parsed;
  };

  const handleSignOut = async () => {
    // Check if it's an admin user (stored in localStorage)
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      localStorage.removeItem('auth_user');
      window.location.reload(); // Refresh to update auth state
      toast({ title: 'Signed out successfully', description: 'Come back soon!' });
      return;
    }

    // Regular Supabase sign out
    const { error } = await signOut();
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Signed out successfully', description: 'Come back soon!' });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchProducts(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleSearchSelect = (product: SearchableProduct) => {
    setLocation(product.route);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Privilege Club', path: '/privilege-club' },
    { name: 'Cat Food', path: '/cat-food' },
    { name: 'Dog Food', path: '/dog-food' },
    { name: 'Cat Toys', path: '/cat-toys' },
    { name: 'Cat Litter', path: '/cat-litter' },
    { name: 'Reflex', path: '/brands/reflex' },
    { name: 'Blog', path: '/blog' }
  ];

  const categories = [
    { label: 'Cat Food', href: '/cat-food', hasSubCategories: true },
    { label: 'Cat Toys', href: '/cat-toys', hasSubCategories: false },
    { label: 'Cat Litter', href: '/cat-litter', hasSubCategories: true },
    { label: 'Cat Care & Health', href: '/cat-care', hasSubCategories: false },
    { label: 'Clothing, Beds & Carrier', href: '/cat-accessories', hasSubCategories: true },
    { label: 'Cat Accessories', href: '/cat-accessories', hasSubCategories: true },
    { label: 'Dog Health & Accessories', href: '/dog-accessories', hasSubCategories: true },
    { label: 'Dog Food', href: '/dog-food', hasSubCategories: true },
    { label: 'Rabbit Food & Accessories', href: '/rabbit', hasSubCategories: true },
    { label: 'Bird Food & Accessories', href: '/bird', hasSubCategories: true },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white">
      {/* Top Announcement Bar */}
      <div className="bg-[#38603d] text-white py-2 text-sm overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-[#2d4f31] px-3 py-1 rounded-full text-xs">
                <Phone size={12} className="mr-1" />
                <span>+880-1234-567890</span>
              </div>
              <div className="flex items-center bg-[#2d4f31] px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-[#224228] transition-colors">
                <Truck size={12} className="mr-1" />
                <span>Our location</span>
              </div>
              <div className="flex items-center bg-[#2d4f31] px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-[#224228] transition-colors">
                <Shield size={12} className="mr-1" />
                <span>Track Your Order</span>
              </div>
            </div>

            {/* Scrolling Announcement Area - Between left and right sections */}
            <div className="flex-1 flex justify-center items-center relative overflow-hidden mx-2 min-h-[24px]">
              {currentAnnouncement && (
                <div className="w-full h-full relative">
                  <div className="animate-marquee whitespace-nowrap absolute top-0 left-0 h-full flex items-center" style={{ width: 'max-content' }}>
                    <div className="inline-flex items-center text-white text-xs font-medium">
                      <Speaker size={12} className="mr-2" />
                      <span dangerouslySetInnerHTML={{ __html: parseAnnouncementText(currentAnnouncement.text) }} />
                    </div>
                  </div>
                  <div className="animate-marquee2 whitespace-nowrap absolute top-0 left-0 h-full flex items-center" style={{ width: 'max-content' }}>
                    <div className="inline-flex items-center text-white text-xs font-medium">
                      <Speaker size={12} className="mr-2" />
                      <span dangerouslySetInnerHTML={{ __html: parseAnnouncementText(currentAnnouncement.text) }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-xs">Follow:</span>
              <a href="#" className="text-white hover:text-black transition-colors p-1 rounded">
                <Facebook size={14} />
              </a>
              <a href="#" className="text-white hover:text-black transition-colors p-1 rounded">
                <Instagram size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
            {/* Logo + Search */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 w-full">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <img src={logoPath} alt="Meow Meow Pet Shop Logo" className="h-10 w-10 mr-2" />
                <div>
                  <h1 className="text-lg font-bold text-[#26732d]">Meow Meow</h1>
                  <p className="text-xs text-gray-600">Pet Shop</p>
                </div>
              </Link>

              <div className="flex-1 mt-4 lg:mt-0" ref={searchRef}>
                <div className="relative">
                  <Input type="text" placeholder="Search for pet food, toys, accessories..." value={searchQuery} onChange={handleSearchChange} className="w-full py-2 px-4 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#ffde59] focus:outline-none text-sm" data-testid="input-global-search" />
                  <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ffde59] text-black px-3 py-1 rounded-md hover:bg-[#ffd73e] transition-colors" data-testid="button-search">
                    <Search size={14} />
                  </Button>

                  {showSearchResults && searchResults.length > 0 && (
                    <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
                      <CardContent className="p-0">
                        {searchResults.map((product) => (
                          <div key={product.id} className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0" onClick={() => handleSearchSelect(product)} data-testid={`search-result-${product.id}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-sm">{product.name}</h4>
                                <p className="text-xs text-gray-600">{product.brand} • {product.category}</p>
                                <p className="text-xs text-blue-600">{product.page}</p>
                              </div>
                              <span className="text-sm font-bold text-green-600">{product.price}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {showSearchResults && searchResults.length === 0 && searchQuery.trim() && (
                    <Card className="absolute top-full left-0 right-0 mt-1 z-50">
                      <CardContent className="p-4 text-center text-gray-500 text-sm">
                        No products found for "{searchQuery}"
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            {/* Account + Cart */}
            <div className="flex items-center space-x-4">
              {!loading && user ? (
                <div className="flex items-center space-x-3">
                  {/* Circular Avatar */}
                  <div className="relative group">
                    <Link href="/dashboard">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#26732d] to-[#1d5624] flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
                        {(user.firstName?.[0] || user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                      </div>
                    </Link>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.name || user.email?.split('@')[0]}
                      <div className="text-xs opacity-75 mt-1">
                        Click to view dashboard
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#26732d]" onClick={handleSignOut}>
                    <LogOut size={18} />
                    <span className="ml-1">Sign Out</span>
                  </Button>
                </div>
              ) : !loading ? (
                <div className="flex items-center space-x-2">
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#26732d]" data-testid="button-sign-in-desktop">
                      <User size={18} />
                      <span className="ml-1">Sign In</span>
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="outline" size="sm" className="text-[#26732d] border-[#26732d] hover:bg-green-50" data-testid="button-sign-up-desktop">
                      <span>Sign Up</span>
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
              )}
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#26732d] relative" data-testid="button-cart">
                  <ShoppingCart size={18} />
                  <span className="ml-1">Cart</span>
                  {cartState.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ffde59] text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {cartState.itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="mt-4 border-t pt-4 relative">
            <div className="flex items-center gap-6">
              {/* Categories Button - First Item */}
              <div>
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-[#26732d] font-medium flex items-center gap-1 bg-gray-50"
                  onClick={toggleSidebar}
                  data-testid="button-categories-toggle"
                >
                  <Menu size={16} />
                  Categories
                </Button>
              </div>

              {/* Main Navigation Items */}
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link href={item.path}>
                    <Button variant="ghost" className="text-gray-700 hover:text-[#26732d] font-medium" data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.name}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}