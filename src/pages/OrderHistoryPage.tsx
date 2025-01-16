import React from 'react';
import { Clock, Download, Package } from 'lucide-react';
import { useUserDetails } from '../hooks/useUserDetails';
import { usePageTitle } from '../utils/usePageTitle';

export function OrderHistoryPage() {
  const { orders, loading, error } = useUserDetails();
  usePageTitle('Order History');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Order History</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
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

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Order History</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No order history</h2>
          <p className="text-gray-600">Your completed orders will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Order History</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Order {order.id}</h3>
                  <p className="text-sm text-gray-600">Placed on {order.date}</p>
                </div>
                <button 
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  onClick={() => window.print()}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Invoice
                </button>
              </div>

              <div className="border-t border-b py-4 my-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'Delivered'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}