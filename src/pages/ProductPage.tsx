import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { usePageTitle } from '../utils/usePageTitle';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Truck, 
  Shield, 
  RefreshCw,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  MessageCircle
} from 'lucide-react';

type Tab = 'description' | 'specifications' | 'reviews' | 'shipping';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find(p => p.id === Number(id));
  
  // Set page title
  usePageTitle(product ? product.title : 'Product Not Found');

  // Get related products from the same category
  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: "John D.",
      rating: 5,
      date: "2024-02-15",
      comment: "Excellent product! Exactly what I was looking for.",
      helpful: 12,
      notHelpful: 2,
      verified: true
    },
    {
      id: 2,
      user: "Sarah M.",
      rating: 4,
      date: "2024-02-10",
      comment: "Good quality, but shipping took longer than expected.",
      helpful: 8,
      notHelpful: 1,
      verified: true
    }
  ];

  // Mock specifications data
  const specifications = [
    { label: "Brand", value: "EasyShop" },
    { label: "Model", value: "2024 Edition" },
    { label: "Warranty", value: "1 Year" },
    { label: "Material", value: "Premium Quality" },
    { label: "Country of Origin", value: "United States" }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-lg mb-8"></div>
          <div className="bg-gray-200 h-8 w-2/3 rounded mb-4"></div>
          <div className="bg-gray-200 h-4 w-1/3 rounded mb-8"></div>
          <div className="bg-gray-200 h-24 rounded mb-8"></div>
          <div className="bg-gray-200 h-12 w-48 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Create an array of product images (in a real app, this would come from the product data)
  const productImages = [product.image];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link to={`/category/${product.category}`} className="hover:text-blue-600 capitalize">
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-900 truncate">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <img
              src={productImages[selectedImage]}
              alt={product.title}
              className="w-full h-96 object-contain"
            />
          </div>
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg p-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-20 object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating.rate)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({product.rating.count} reviews)
            </span>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-sm text-green-600 mt-1">
              Free shipping on orders over $50
            </p>
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center text-sm text-gray-600">
              <Truck className="h-5 w-5 mr-2 text-blue-600" />
              Fast Delivery
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              1 Year Warranty
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <RefreshCw className="h-5 w-5 mr-2 text-blue-600" />
              30-Day Returns
            </div>
          </div>

          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
            <button className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {(['description', 'specifications', 'reviews', 'shipping'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {activeTab === 'description' && (
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium">{review.user}</span>
                        {review.verified && (
                          <span className="ml-2 text-xs text-green-600">Verified Purchase</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">{review.comment}</p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpful})
                      </button>
                      <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Not Helpful ({review.notHelpful})
                      </button>
                      <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Delivery Options</h3>
                  <p className="text-gray-600">
                    Standard Shipping (5-7 business days): FREE on orders over $50
                    <br />
                    Express Shipping (2-3 business days): $12.99
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Return Policy</h3>
                  <p className="text-gray-600">
                    We offer a 30-day return policy for most items. Items must be unused and in original packaging.
                    Return shipping costs may apply.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-4">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.title}
                    className="w-full h-48 object-contain mb-4"
                  />
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {relatedProduct.title}
                  </h3>
                  <p className="text-lg font-bold text-gray-900">
                    ${relatedProduct.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}