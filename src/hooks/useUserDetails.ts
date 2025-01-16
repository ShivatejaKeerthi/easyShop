import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/firebase';

export function useUserDetails() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return;

      try {
        setLoading(true);
        const [ordersData, wishlistData] = await Promise.all([
          userService.getOrders(user.id),
          userService.getWishlist(user.id)
        ]);
        
        setOrders(ordersData);
        setWishlist(wishlistData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user?.id]);

  const addToWishlist = async (productId: number) => {
    if (!user?.id) return;
    
    try {
      await userService.addToWishlist(user.id, productId);
      setWishlist(prev => [...prev, productId]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user?.id) return;
    
    try {
      await userService.removeFromWishlist(user.id, productId);
      setWishlist(prev => prev.filter(id => id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from wishlist');
    }
  };

  return {
    loading,
    error,
    orders,
    wishlist,
    addToWishlist,
    removeFromWishlist
  };
}