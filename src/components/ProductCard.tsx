import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative pt-[100%]">
          <img
            src={product.image}
            alt={product.title}
            className="absolute top-0 left-0 w-full h-full object-contain p-4"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">{product.title}</h3>
          <div className="flex items-center mb-2">
            <Star className={`h-4 w-4 ${product.rating.rate >= 4 ? 'text-yellow-400' : 'text-gray-400'}`} />
            <span className="ml-1 text-sm text-gray-600">{product.rating.rate} ({product.rating.count} reviews)</span>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}