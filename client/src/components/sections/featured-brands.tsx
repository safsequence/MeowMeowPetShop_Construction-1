import { Link } from 'wouter';

export default function FeaturedBrands() {
  const brands = [
    { name: 'NEKKO', slug: 'nekko' },
    { name: 'PURINA', slug: 'purina' },
    { name: 'ONE', slug: 'one' },
    { name: 'Reflex', slug: 'brands/reflex' },
    { name: 'Reflex Plus', slug: 'reflex-plus' },
    { name: 'ROYAL CANIN', slug: 'royal-canin' },
    { name: 'Sheba', slug: 'sheba' }
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#26732d]">FEATURED BRANDS</h3>
          <Link href="/brands" className="text-sm text-gray-600 hover:text-[#26732d] transition-colors">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {brands.map((brand, index) => (
            <Link 
              key={index} 
              href={brand.slug.startsWith('/') ? brand.slug : `/brands/${brand.slug}`}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity group"
            >
              <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                <span className="text-gray-800 font-bold text-xs text-center px-2 leading-tight">{brand.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
