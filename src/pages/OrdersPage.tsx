import React from 'react';
import { Package, Clock, ChevronRight } from 'lucide-react';
import { useUserDetails } from '../hooks/useUserDetails';
import { usePageTitle } from '../utils/usePageTitle';

export function OrdersPage() {
  const { orders, loading, error } = useUserDetails();
  usePageTitle('My Orders');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
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

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-600">When you place an order, it will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Order #{order.id}</p>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.status === 'Delivered' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">{order.items.length} items</p>
                <p className="font-semibold">${order.total.toFixed(2)}</p>
              </div>
              <button className="flex items-center text-blue-600 hover:text-blue-800">
                View Details
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}