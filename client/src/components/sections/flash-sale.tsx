import { Flame } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';

export default function FlashSale() {
  const flashSaleProducts: any[] = [];

  return (
    <section className="section-spacing bg-red-50">
      <div className="responsive-container">
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-red-100 px-4 sm:px-6 py-3 rounded-lg mb-6 w-fit mx-auto border-2 border-red-200 animate-scale-up">
            <Flame className="text-red-600" size={24} />
            <span className="text-red-600 font-bold text-lg">Flash Sale</span>
            <span className="text-sm text-red-600 font-medium">Limited Time Offers</span>
          </div>
        </div>

        <div className="responsive-grid">
          {flashSaleProducts.map((product, index) => (
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