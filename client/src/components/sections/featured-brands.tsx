
import { Link } from 'wouter';

export default function FeaturedBrands() {
  const brands = [
    { 
      name: 'NEKKO', 
      slug: 'nekko',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Nekko_logo.png/200px-Nekko_logo.png'
    },
    { 
      name: 'PURINA', 
      slug: 'purina',
      logo: 'https://logos-world.net/wp-content/uploads/2021/10/Purina-Logo.png'
    },
    { 
      name: 'ONE', 
      slug: 'one',
      logo: 'https://www.purina.com/sites/default/files/2021-12/purina-one-logo.png'
    },
    { 
      name: 'Reflex', 
      slug: 'brands/reflex',
      logo: 'https://www.reflexpetfood.com/wp-content/uploads/2020/01/reflex-logo.png'
    },
    { 
      name: 'Reflex Plus', 
      slug: 'reflex-plus',
      logo: 'https://www.reflexplus.com.tr/assets/images/logo.png'
    },
    { 
      name: 'ROYAL CANIN', 
      slug: 'royal-canin',
      logo: 'https://logos-world.net/wp-content/uploads/2021/10/Royal-Canin-Logo.png'
    },
    { 
      name: 'Sheba', 
      slug: 'sheba',
      logo: 'https://logos-world.net/wp-content/uploads/2021/10/Sheba-Logo.png'
    }
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[#26732d] text-center">FEATURED BRANDS</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {brands.map((brand, index) => (
            <Link 
              key={index} 
              href={brand.slug.startsWith('/') ? brand.slug : `/brands/${brand.slug}`}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity group"
            >
              <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow p-2">
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('span');
                    fallback.textContent = brand.name;
                    fallback.className = 'text-gray-800 font-bold text-xs text-center px-2 leading-tight';
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
