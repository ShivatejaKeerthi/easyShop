import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Cart } from '../components/Cart';
import { usePageTitle } from '../utils/usePageTitle';

export function CartPage() {
  const { cartItems } = useCart();
  
  // Set page title
  usePageTitle('Shopping Cart');

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-gray-100 rounded-full p-6 inline-block mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. 
            Start shopping and discover amazing products!
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/track-order" className="text-gray-600 hover:text-blue-600 transition-colors">
              Track Order
            </Link>
            <span className="hidden sm:inline text-gray-300">•</span>
            <Link to="/shipping" className="text-gray-600 hover:text-blue-600 transition-colors">
              Shipping Information
            </Link>
            <span className="hidden sm:inline text-gray-300">•</span>
            <Link to="/returns" className="text-gray-600 hover:text-blue-600 transition-colors">
              Returns Policy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <Cart />
    </div>
  );
}