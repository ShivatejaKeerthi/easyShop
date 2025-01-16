import React from 'react';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      alert('This is a prototype. Checkout is not implemented.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <a href="/" className="text-blue-600 hover:underline">Continue Shopping</a>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Shopping Cart</h2>
        <div className="grid grid-cols-1 gap-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow">
              <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">${item.price}</p>
                <div className="flex items-center mt-2">
                  <select
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold">${total.toFixed(2)}</span>
          </div>
          <button
            className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}