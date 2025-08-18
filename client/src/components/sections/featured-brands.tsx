import { Link } from "wouter";

export default function FeaturedBrands() {
  const brands = [
    {
      name: "NEKKO",
      slug: "nekko",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452121.svg",
    },
    {
      name: "PURINA",
      slug: "purina",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452544.png",
    },
    {
      name: "ONE",
      slug: "one",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452560.svg",
    },
    {
      name: "Reflex",
      slug: "brands/reflex",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452600.svg",
    },
    {
      name: "Reflex Plus",
      slug: "reflex-plus",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452616.png",
    },
    {
      name: "ROYAL CANIN",
      slug: "royal-canin",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452634.png",
    },
    {
      name: "Sheba",
      slug: "sheba",
      logo: "https://mewmewshopbd.com/uploads/brand/2024/1719452653.svg",
    },
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
              href={
                brand.slug.startsWith("/")
                  ? brand.slug
                  : `/brands/${brand.slug}`
              }
              className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-all duration-300 group hover:scale-105"
            >
              <div className="w-20 h-16 sm:w-24 sm:h-18 md:w-28 md:h-20 lg:w-32 lg:h-22 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-full h-full object-contain p-2"
                  style={{
                    imageRendering: "auto",
                  }}
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/150x100/f3f4f6/374151?text=${encodeURIComponent(brand.name)}`;
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
