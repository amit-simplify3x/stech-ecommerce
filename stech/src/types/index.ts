export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'none';

export interface FilterState {
  category: string;
  minRating: number;
  sortBy: SortOption;
}

