import { Dog } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';

export default function BestsellersDogs() {
  const products: any[] = [];

  return (
    <section className="section-spacing bg-white">
      <div className="responsive-container">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#26732d] mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
          <Dog size={32} className="text-[#26732d]" />
          Bestsellers for Dogs
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