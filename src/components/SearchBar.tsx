import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearch }: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const { products } = useProducts();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle clicks outside of search component
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, products]);

  const handleProductClick = (product: Product) => {
    setShowSuggestions(false);
    onSearch('');
    navigate(`/product/${product.id}`);
  };

  const clearSearch = () => {
    onSearch('');
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => searchQuery && setShowSuggestions(true)}
          className="w-full px-4 py-2 pl-10 pr-10 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 text-gray-500 h-5 w-5" />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="flex items-center w-full p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-12 h-12 object-contain rounded"
              />
              <div className="ml-3 text-left">
                <p className="font-medium text-gray-900 line-clamp-1">{product.title}</p>
                <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && searchQuery && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center text-gray-500">
          No products found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}