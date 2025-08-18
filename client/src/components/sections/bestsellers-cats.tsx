import { Cat } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';

export default function BestsellersCats() {
  const products: any[] = [];

  return (
    <section className="section-spacing bg-gray-50">
      <div className="responsive-container">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#26732d] mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
          <Cat size={32} className="text-[#26732d]" />
          Bestsellers for Cats
        </h2>
        <div className="responsive-grid">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}