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
    { name: 'Reflex', slug: 'brands/reflex', logo: reflexLogo },
    { name: 'Reflex Plus', slug: 'reflex-plus', logo: reflexPlusLogo },
    { name: 'ROYAL CANIN', slug: 'royal-canin', logo: royalCaninLogo },
    { name: 'Sheba', slug: 'sheba', logo: shebaLogo }
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-[#26732d]">FEATURED BRANDS</h3>
        </div>
        <div className="flex justify-center items-center gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-2">
          {brands.map((brand, index) => (
            <Link 
              key={index} 
              href={brand.slug.startsWith('/') ? brand.slug : `/brands/${brand.slug}`}
              className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-all duration-300 group hover:scale-105"
            >
              <div className="w-20 h-16 sm:w-24 sm:h-18 md:w-28 md:h-20 lg:w-32 lg:h-22 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow p-3">
                <img 
                  src={brand.logo} 
                  alt={`${brand.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
