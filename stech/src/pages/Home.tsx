import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/slices/productsSlice';
import { getFilteredAndSortedProducts } from '../utils/productUtils';
import FilterBar from '../components/FilterBar';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import CartDropdown from '../components/CartDropdown';
import { useEffect, useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 12;

const Home = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const filters = useAppSelector((state) => state.filters);
  const favorites = useAppSelector((state) => state.favorites.items);
  const cartItems = useAppSelector((state) => state.cart.items);

  const [currentPage, setCurrentPage] = useState(1);
  const [filterSignature, setFilterSignature] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Get filtered and sorted products
  const filteredProducts = useMemo(
    () => getFilteredAndSortedProducts(products, filters),
    [products, filters]
  );

  // Create a signature from filters to detect changes
  const currentFilterSignature = useMemo(
    () => `${filters.category}-${filters.minRating}-${filters.sortBy}`,
    [filters.category, filters.minRating, filters.sortBy]
  );

  // Reset page when filters change
  useEffect(() => {
    if (filterSignature !== currentFilterSignature) {
      setFilterSignature(currentFilterSignature);
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterSignature]);

  // Calculate the valid page number
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const validPage = Math.min(currentPage, Math.max(1, totalPages || 1));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/50 to-orange-50/30">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-xl border-b-2 border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:rotate-12 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  E-Commerce Store
                </h1>
                <p className="text-sm font-medium text-purple-600">Premium Shopping Experience</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full border-2 border-pink-300 shadow-md hover:shadow-lg transition-shadow">
                <svg
                  className="w-6 h-6 text-pink-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="font-bold text-pink-700">
                  {favorites.length}
                </span>
              </div>
              
              {/* Cart Icon */}
              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="relative p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce-in">
                      {totalCartItems > 99 ? '99+' : totalCartItems}
                    </span>
                  )}
                </button>
                
                {/* Cart Dropdown - Positioned via fixed in component */}
                <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar products={products} />

      {/* Main Content */}
      <main>
        {/* Enhanced Results Count */}
        <div className="container mx-auto px-4 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Discover Products
              </h2>
              <p className="text-gray-600">
                Showing <span className="font-semibold text-blue-600">{filteredProducts.length}</span> product
                {filteredProducts.length !== 1 ? 's' : ''}
                {filteredProducts.length !== products.length && (
                  <span className="ml-1 text-gray-500">
                    (filtered from {products.length} total)
                  </span>
                )}
              </p>
            </div>
            {filteredProducts.length > 0 && (
              <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm text-blue-700 font-medium">
                  Page {validPage} of {totalPages}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={paginatedProducts} loading={loading} />

        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && (
          <Pagination
            currentPage={validPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-purple-900 via-pink-900 to-orange-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400 text-sm">
                Your trusted destination for quality products at amazing prices.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">FAQ</li>
                <li className="hover:text-white transition-colors cursor-pointer">Shipping Info</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">New Arrivals</li>
                <li className="hover:text-white transition-colors cursor-pointer">Best Sellers</li>
                <li className="hover:text-white transition-colors cursor-pointer">Sale</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect</h3>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
                  <span className="text-sm">i</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 E-Commerce Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

