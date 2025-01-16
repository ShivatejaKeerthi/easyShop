import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/firebase';
import { usePageTitle } from '../utils/usePageTitle';

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export function PaymentMethodsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  usePageTitle('Payment Methods');

  const handleAddPaymentMethod = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would integrate with a payment processor
      alert('This is a demo. In a real app, this would open a secure payment form.');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePaymentMethod = async (methodId: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would remove the payment method from the payment processor
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove payment method');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Payment Methods</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Payment Methods</h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <button 
          onClick={handleAddPaymentMethod}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          disabled={loading}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Payment Method
        </button>

        {paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No payment methods</h2>
            <p className="text-gray-600">Add a payment method to make checkout easier.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center">
                  <CreditCard className="h-6 w-6 text-gray-400 mr-4" />
                  <div>
                    <p className="font-medium">
                      {method.type} ending in {method.last4}
                      {method.isDefault && (
                        <span className="ml-2 text-sm text-blue-600">Default</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemovePaymentMethod(method.id)}
                  className="text-red-500 hover:text-red-700"
                  disabled={loading}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}