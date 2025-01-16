import { ref, set, get, update } from 'firebase/database';
import { db } from '../config/firebase';

interface UserDetails {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  preferences?: {
    notifications: boolean;
    marketing: boolean;
  };
}

interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
}

export const userService = {
  async saveUserDetails(userId: string, details: Partial<UserDetails>) {
    try {
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, details);
      return true;
    } catch (error) {
      console.error('Error saving user details:', error);
      throw error;
    }
  },

  async getUserDetails(userId: string): Promise<UserDetails | null> {
    try {
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error getting user details:', error);
      throw error;
    }
  },

  async saveOrder(userId: string, order: Order) {
    try {
      const orderRef = ref(db, `users/${userId}/orders/${order.id}`);
      await set(orderRef, order);
      return true;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  },

  async getOrders(userId: string): Promise<Order[]> {
    try {
      const ordersRef = ref(db, `users/${userId}/orders`);
      const snapshot = await get(ordersRef);
      return snapshot.exists() ? Object.values(snapshot.val()) : [];
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  },

  async addToWishlist(userId: string, productId: number) {
    try {
      const wishlistRef = ref(db, `users/${userId}/wishlist/${productId}`);
      await set(wishlistRef, true);
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  async removeFromWishlist(userId: string, productId: number) {
    try {
      const wishlistRef = ref(db, `users/${userId}/wishlist/${productId}`);
      await set(wishlistRef, null);
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  async getWishlist(userId: string): Promise<number[]> {
    try {
      const wishlistRef = ref(db, `users/${userId}/wishlist`);
      const snapshot = await get(wishlistRef);
      return snapshot.exists() ? Object.keys(snapshot.val()).map(Number) : [];
    } catch (error) {
      console.error('Error getting wishlist:', error);
      throw error;
    }
  }
};