import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { addToCart } from '../store/slices/cartSlice';
import type { Product } from '../types';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const products = useAppSelector((state) => state.products.items);
  const favorites = useAppSelector((state) => state.favorites.items);
  const cartItems = useAppSelector((state) => state.cart.items);
  
  const product = products.find((p: Product) => p.id === Number(id));
  const isFavorite = product ? favorites.includes(product.id) : false;
  const isInCart = product ? cartItems.some((item) => item.id === product.id) : false;
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Go Back to Store
          </button>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product.id));
  };

  const handleAddToCart = () => {
    if (product) {
      setIsAdding(true);
      dispatch(addToCart(product));
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-6 h-6 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          className="w-6 h-6 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id={`half-fill-${product.id}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#half-fill-${product.id})`}
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-6 h-6 text-gray-300 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/50 to-orange-50/30">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-lg shadow-xl border-b-2 border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Products</span>
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-3xl shadow-2xl overflow-hidden max-w-7xl mx-auto border-2 border-purple-100">
          <div className="lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image Section */}
            <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-8 lg:p-12">
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-lg bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              </div>
              
              {/* Favorite Button - Large */}
              <button
                onClick={handleToggleFavorite}
                className={`absolute top-6 right-6 z-10 p-4 rounded-full transition-all duration-300 shadow-lg ${
                  isFavorite
                    ? 'bg-pink-500 text-white scale-110'
                    : 'bg-white/90 text-gray-400 hover:bg-white hover:text-pink-500 hover:scale-110'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg
                  className="w-7 h-7 transition-transform duration-300"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Product Info Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-4 py-2 text-sm font-bold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border-2 border-purple-200">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
                <span className="text-xl font-semibold text-gray-700">
                  {product.rating} / 5.0
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">Based on reviews</span>
              </div>

              {/* Price Section */}
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl border-2 border-purple-200 shadow-lg">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through opacity-60">
                    ₹{(product.price * 1.2).toFixed(2)}
                  </span>
                </div>
                <p className="text-green-600 font-bold mt-2 flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  You save ₹{((product.price * 1.2) - product.price).toFixed(2)}!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || isInCart}
                  className={`flex-1 px-8 py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                    isInCart
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-not-allowed'
                      : isAdding
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white hover:from-purple-700 hover:via-pink-700 hover:to-orange-600'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Adding...
                    </>
                  ) : isInCart ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      In Cart
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
                <button className="flex-1 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-bold text-lg hover:from-gray-800 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Buy Now
                </button>
              </div>

              {/* Product Details */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Details</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Experience premium quality with this exceptional {product.category.toLowerCase()} product. 
                    Designed with attention to detail and built to last, this item combines style and functionality 
                    for the modern consumer.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Category</p>
                    <p className="font-semibold text-gray-900">{product.category}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Rating</p>
                    <p className="font-semibold text-gray-900">{product.rating} / 5.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600 text-sm">On orders above ₹500</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">↩️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600 text-sm">30-day return policy</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-gray-600 text-sm">100% secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

