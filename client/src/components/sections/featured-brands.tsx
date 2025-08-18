import { Link } from 'wouter';
import nekkoLogo from '@assets/generated_images/NEKKO_brand_logo_design_860189ca.png';
import purinaLogo from '@assets/generated_images/PURINA_official_logo_0d40baeb.png';
import purinaOneLogo from '@assets/generated_images/Purina_ONE_logo_f7cd7147.png';
import reflexLogo from '@assets/generated_images/Reflex_brand_logo_6da9e437.png';
import reflexPlusLogo from '@assets/generated_images/Reflex_Plus_logo_f7b1138b.png';
import royalCaninLogo from '@assets/generated_images/ROYAL_CANIN_logo_206735e0.png';
import shebaLogo from '@assets/generated_images/Sheba_brand_logo_49a6d9c0.png';

export default function FeaturedBrands() {
  const brands = [
    { name: 'NEKKO', slug: 'nekko', logo: nekkoLogo },
    { name: 'PURINA', slug: 'purina', logo: purinaLogo },
    { name: 'ONE', slug: 'one', logo: purinaOneLogo },
    { name: 'Reflex', slug: 'reflex', logo: reflexLogo },
    { name: 'Reflex Plus', slug: 'reflex-plus', logo: reflexPlusLogo },
    { name: 'ROYAL CANIN', slug: 'royal-canin', logo: royalCaninLogo },
    { name: 'Sheba', slug: 'sheba', logo: shebaLogo }
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
              href={brand.slug === 'reflex' ? '/reflex' : `/brands/${brand.slug}`}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity group"
            >
              <div className="w-24 h-20 bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow p-2">
                <img 
                  src={brand.logo} 
                  alt={`${brand.name} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
