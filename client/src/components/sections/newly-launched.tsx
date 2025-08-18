import { Sparkles } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';

export default function NewlyLaunched() {
  const products: any[] = [];

  return (
    <section className="py-12 bg-[#f0f8ff]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#26732d] mb-8 flex items-center justify-center gap-3">
          <Sparkles size={32} className="text-[#26732d]" />
          Newly Launched
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out relative">
              <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 z-10">
                <Sparkles size={12} />
                JUST IN
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
