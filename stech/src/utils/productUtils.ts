import type { Product, FilterState } from '../types';

export const getFilteredAndSortedProducts = (
  products: Product[],
  filters: FilterState
): Product[] => {
  let filtered = [...products];

  // Filter by category
  if (filters.category !== 'all') {
    filtered = filtered.filter((product) => product.category === filters.category);
  }

  // Filter by minimum rating
  if (filters.minRating > 0) {
    filtered = filtered.filter((product) => product.rating >= filters.minRating);
  }

  // Sort products
  if (filters.sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
};

export const getUniqueCategories = (products: Product[]): string[] => {
  const categories = products.map((product) => product.category);
  return Array.from(new Set(categories)).sort();
};

