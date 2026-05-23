import { create } from 'zustand';
import { Product } from '../../shared/types';

interface StoreState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProducts: Product[];
  searchKeyword: string;
  selectedPlatforms: string[];
  sortBy: 'price' | 'sales' | 'rating';
  sortOrder: 'asc' | 'desc';
  
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleProductSelection: (product: Product) => void;
  clearSelection: () => void;
  setSearchKeyword: (keyword: string) => void;
  setSelectedPlatforms: (platforms: string[]) => void;
  setSortBy: (sortBy: 'price' | 'sales' | 'rating') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  reset: () => void;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  loading: false,
  error: null,
  selectedProducts: [],
  searchKeyword: '',
  selectedPlatforms: ['jd', 'taobao', 'pinduoduo'],
  sortBy: 'price',
  sortOrder: 'asc',

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  toggleProductSelection: (product) => set((state) => {
    const isSelected = state.selectedProducts.some(p => p.id === product.id);
    return {
      selectedProducts: isSelected
        ? state.selectedProducts.filter(p => p.id !== product.id)
        : [...state.selectedProducts, product]
    };
  }),
  
  clearSelection: () => set({ selectedProducts: [] }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),
  
  reset: () => set({
    products: [],
    loading: false,
    error: null,
    selectedProducts: [],
    searchKeyword: '',
    selectedPlatforms: ['jd', 'taobao', 'pinduoduo'],
    sortBy: 'price',
    sortOrder: 'asc'
  })
}));
