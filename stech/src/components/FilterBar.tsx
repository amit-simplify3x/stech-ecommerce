import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCategory, setMinRating, setSortBy, resetFilters } from '../store/slices/filtersSlice';
import { getUniqueCategories } from '../utils/productUtils';
import type { Product, SortOption } from '../types';

interface FilterBarProps {
  products: Product[];
}

const FilterBar = ({ products }: FilterBarProps) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const categories = getUniqueCategories(products);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'none', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ];

  const ratingOptions = [0, 1, 2, 3, 4, 4.5];

  return (
    <div className="sticky top-[88px] z-40 bg-white/95 backdrop-blur-lg shadow-xl border-b-2 border-purple-100">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => dispatch(setCategory('all'))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  filters.category === 'all'
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:shadow-md'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => dispatch(setCategory(category))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    filters.category === category
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Minimum Rating
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => dispatch(setMinRating(0))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  filters.minRating === 0
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:shadow-md'
                }`}
              >
                Any
              </button>
              {ratingOptions.slice(1).map((rating) => (
                <button
                  key={rating}
                  onClick={() => dispatch(setMinRating(rating))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 transform hover:scale-105 ${
                    filters.minRating === rating
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:shadow-md'
                  }`}
                >
                  <span>{rating}+</span>
                  <svg
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className="flex-1 lg:max-w-xs">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as SortOption))}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="lg:flex-shrink-0 flex items-end">
            <button
              onClick={() => dispatch(resetFilters())}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

