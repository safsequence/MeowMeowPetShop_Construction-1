import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  category: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  brandSlug?: string;
  description?: string;
  tags: string[];
  features?: string[];
  specifications?: any;
  stock: number;
  stockStatus?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  isOnSale?: boolean;
  discount?: number;
  isLowStock?: boolean;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductsByCategory = (categoryId: string) => {
    if (categoryId === 'all' || !categoryId) return products;
    return products.filter(product => product.category === categoryId);
  };

  const getProductsByBrand = (brandSlug: string) => {
    return products.filter(product => {
      // Match by brand slug (for brand pages)
      return product.tags?.some(tag => 
        tag.toLowerCase().includes(brandSlug.toLowerCase())
      ) || product.name.toLowerCase().includes(brandSlug.toLowerCase());
    });
  };

  const searchProducts = (query: string) => {
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  return {
    products,
    loading,
    error,
    getProductsByCategory,
    getProductsByBrand,
    searchProducts,
    refetch: () => window.location.reload() // Simple refetch
  };
}