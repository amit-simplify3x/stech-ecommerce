import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { addToCart } from '../store/slices/cartSlice';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const cartItems = useAppSelector((state) => state.cart.items);
  const isFavorite = favorites.includes(product.id);
  const isInCart = cartItems.some((item) => item.id === product.id);
  const [isAdding, setIsAdding] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(product.id));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    dispatch(addToCart(product));
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 text-yellow-400 fill-current"
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
          className="w-4 h-4 text-yellow-400 fill-current"
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
          className="w-4 h-4 text-gray-300 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border border-purple-100 ${
        isFavorite ? 'ring-2 ring-pink-500 shadow-pink-200' : ''
      }`}
    >
      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
          isFavorite
            ? 'bg-pink-500 text-white scale-110'
            : 'bg-white/80 text-gray-400 hover:bg-white hover:text-pink-500'
        }`}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isFavorite ? 'scale-100' : 'scale-90'
          }`}
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

      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-pink-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* View Details Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600/30 to-pink-600/30">
          <span className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full text-sm shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 animate-bounce-in">
            View Details
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 text-xs font-bold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200">
            {product.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">{renderStars(product.rating)}</div>
          <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              ₹{product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400 line-through ml-2">
              ₹{(product.price * 1.15).toFixed(2)}
            </span>
          </div>
          <div className="px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-md">
            Save 15%
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 transform ${
            isInCart
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
              : isAdding
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-95'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-md hover:shadow-xl hover:scale-105'
          }`}
        >
          {isAdding ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding...
            </span>
          ) : isInCart ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              In Cart
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add to Cart
            </span>
          )}
        </button>
      </div>

      {/* Favorite Highlight Animation */}
      {isFavorite && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-pink-500/5 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
