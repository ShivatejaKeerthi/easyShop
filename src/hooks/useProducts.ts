import { useState, useEffect } from 'react';
import { Product } from '../types';
import { dummyProducts } from '../data/dummyProducts';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        
        // Combine API products with dummy products
        const allProducts = [...data, ...dummyProducts];
        setProducts(allProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(allProducts.map((product: Product) => 
          product.category.toLowerCase()
        ))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error, categories };
}