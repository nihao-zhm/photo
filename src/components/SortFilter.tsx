import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, ShoppingCart, Star, DollarSign } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { Product } from '../../shared/types';
import { DataProcessor } from '../../api/dataProcessor';

interface SortFilterProps {
  products: Product[];
}

export const SortFilter: React.FC<SortFilterProps> = ({ products }) => {
  const { 
    sortBy, 
    sortOrder, 
    setSortBy, 
    setSortOrder,
    selectedProducts,
    clearSelection
  } = useStore();

  const stats = React.useMemo(() => {
    return DataProcessor.getPriceStatistics(products);
  }, [products]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortOptions = [
    { key: 'price', label: '价格', icon: DollarSign },
    { key: 'sales', label: '销量', icon: ShoppingCart },
    { key: 'rating', label: '评分', icon: Star },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter size={20} />
            <span className="font-medium">排序方式</span>
          </div>

          <div className="flex items-center gap-2">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              const isActive = sortBy === option.key;
              
              return (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  {option.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-all"
          >
            {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            {sortOrder === 'asc' ? '升序' : '降序'}
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-500">最低</div>
              <div className="text-lg font-bold text-success-600">¥{stats.min.toLocaleString()}</div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <div className="text-gray-500">最高</div>
              <div className="text-lg font-bold text-red-600">¥{stats.max.toLocaleString()}</div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <div className="text-gray-500">平均</div>
              <div className="text-lg font-bold text-primary-600">¥{stats.avg.toLocaleString()}</div>
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-3 bg-primary-50 px-4 py-2 rounded-lg">
              <span className="text-primary-700 font-medium">
                已选 {selectedProducts.length} 件商品
              </span>
              <button
                onClick={clearSelection}
                className="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                清除
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
