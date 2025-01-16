import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useUserDetails } from '../hooks/useUserDetails';
import { usePageTitle } from '../utils/usePageTitle';
import { Link } from 'react-router-dom';

export function WishlistPage() {
  const { products } = useProducts();
  const { wishlist, removeFromWishlist, loading, error } = useUserDetails();
  const { addToCart } = useCart();
  usePageTitle('My Wishlist');

  const wishlistItems = products.filter(product => wishlist.includes(product.id));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-4">Save items you'd like to buy later!</p>
          <Link 
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            Continue Shopping
            <ShoppingCart className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-48 object-contain mb-4"
            />
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">${item.price.toFixed(2)}</p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => addToCart(item)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => removeFromWishlist(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Heart className="h-5 w-5 fill-current" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}