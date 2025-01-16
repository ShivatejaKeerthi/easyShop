import React, { useState } from 'react';
import { ShoppingCart, Menu, User, X, LogOut, Package, Settings, CreditCard, Heart, Clock, UserCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { AuthModal } from './AuthModal';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  onCartClick: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function Header({ onCartClick, onSearch, searchQuery }: HeaderProps) {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  const categories = [
    'Electronics',
    'Furniture',
    'Accessories',
    'Gadgets',
  ];

  const handleCategoryClick = (category: string) => {
    setIsMenuOpen(false);
    navigate(`/category/${category.toLowerCase()}`);
  };

  const handleAuthClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userMenuItems = [
    { icon: UserCircle, label: 'Profile', path: '/profile' },
    { icon: Package, label: 'Orders', path: '/orders' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: Clock, label: 'Order History', path: '/order-history' },
    { icon: CreditCard, label: 'Payment Methods', path: '/payment-methods' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 hover:bg-gray-800 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-1'
                }`}></span>
                <span className={`absolute block w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out translate-y-2.5 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute block w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-4'
                }`}></span>
              </div>
            </button>
            <Link to="/" className="text-xl font-bold">EasyShop</Link>
          </div>
          
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <SearchBar searchQuery={searchQuery} onSearch={onSearch} />
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="p-1 hover:bg-gray-800 rounded-lg flex items-center gap-2"
                onClick={handleAuthClick}
                onMouseEnter={() => user && setIsUserMenuOpen(true)}
              >
                <User className="h-6 w-6" />
                {user && (
                  <span className="hidden md:inline text-sm">{user.name}</span>
                )}
              </button>

              {user && isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 text-gray-800"
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Link>
                  ))}

                  <div className="border-t border-gray-100 mt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="p-1 hover:bg-gray-800 rounded-lg relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search - visible only on mobile */}
        <div className="md:hidden pb-4">
          <SearchBar searchQuery={searchQuery} onSearch={onSearch} />
        </div>
      </div>

      {/* Mobile menu - slides down when menu is open */}
      <div 
        className={`fixed inset-x-0 top-[4rem] transform ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        } transition-all duration-300 ease-in-out md:hidden bg-gray-800 shadow-lg overflow-y-auto max-h-[calc(100vh-4rem)]`}
      >
        <nav className="container mx-auto px-4 py-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => handleCategoryClick(category)}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
          
          {user ? (
            <>
              <h3 className="text-sm font-semibold text-gray-400 mt-6 mb-2">Account</h3>
              <ul className="space-y-2">
                {userMenuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full py-2 px-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <div className="mt-6">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </nav>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}