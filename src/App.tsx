import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Carousel } from './components/Carousel';
import { Footer } from './components/Footer';
import { useProducts } from './hooks/useProducts';
import { Product } from './types';
import { CategoryPage } from './pages/CategoryPage';
import { CartPage } from './pages/CartPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { PaymentMethodsPage } from './pages/PaymentMethodsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProductPage } from './pages/ProductPage';
import { usePageTitle } from './utils/usePageTitle';

function HomePage({ searchQuery, onSearch }: { searchQuery: string; onSearch: (query: string) => void }) {
  const { products, loading, error, categories } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Set page title for home page
  usePageTitle('Home');

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="pt-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <Carousel images={carouselImages} />
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Our Products</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-4 py-2 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header 
        onCartClick={handleCartClick}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />
      <main className="flex-grow">
        <Routes>
          <Route 
            path="/" 
            element={<HomePage searchQuery={searchQuery} onSearch={setSearchQuery} />} 
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1920&q=80",
    title: "Latest Tech Deals",
    description: "Save up to 40% on premium electronics",
    link: "/category/electronics"
  },
  {
    url: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1920&q=80",
    title: "Home Office Essentials",
    description: "Create your perfect workspace",
    link: "/category/furniture"
  },
  {
    url: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=1920&q=80",
    title: "Smart Living",
    description: "Upgrade your lifestyle with smart devices",
    link: "/category/electronics"
  }
];

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}