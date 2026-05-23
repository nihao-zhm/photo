import React from 'react';
import { useStore } from '../hooks/useStore';
import { fetchSampleData, searchProducts } from '../utils/api';
import { SearchForm } from '../components/SearchForm';
import { SortFilter } from '../components/SortFilter';
import { ProductCard } from '../components/ProductCard';
import { PriceCharts } from '../components/PriceCharts';
import { ProductComparison } from '../components/ProductComparison';
import { DataProcessor } from '../../api/dataProcessor';
import { Compare, ArrowLeft } from 'lucide-react';

export const Home: React.FC = () => {
  const {
    products,
    loading,
    error,
    selectedProducts,
    searchKeyword,
    selectedPlatforms,
    sortBy,
    sortOrder,
    setProducts,
    setLoading,
    setError,
    toggleProductSelection,
  } = useStore();

  const [showComparison, setShowComparison] = React.useState(false);

  const sortedProducts = React.useMemo(() => {
    return DataProcessor.sortProducts(products, sortBy, sortOrder);
  }, [products, sortBy, sortOrder]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchProducts({
        keyword: searchKeyword,
        platforms: selectedPlatforms as any,
      });
      
      if (response.success) {
        setProducts(response.data);
      } else {
        setError(response.message || '搜索失败');
      }
    } catch (err) {
      setError('搜索失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchSampleData();
      
      if (response.success) {
        setProducts(response.data);
      } else {
        setError(response.message || '加载失败');
      }
    } catch (err) {
      setError('加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {products.length > 0 && (
          <button
            onClick={() => setProducts([])}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            返回首页
          </button>
        )}

        {products.length === 0 ? (
          <SearchForm 
            onSearch={handleSearch}
            onLoadSample={handleLoadSample}
            loading={loading}
          />
        ) : (
          <>
            {selectedProducts.length >= 2 && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
                <button
                  onClick={() => setShowComparison(true)}
                  className="bg-gradient-to-r from-primary-600 to-success-500 text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all flex items-center gap-3"
                >
                  <Compare size={24} />
                  对比 {selectedProducts.length} 件商品
                </button>
              </div>
            )}

            <SortFilter products={products} />

            <PriceCharts products={products} />

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                📦 找到 {sortedProducts.length} 件商品
              </h2>
              <p className="text-gray-500 text-sm">
                点击卡片可以选择商品进行对比
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selected={selectedProducts.some(p => p.id === product.id)}
                  onToggle={() => toggleProductSelection(product)}
                  rank={sortBy === 'price' && sortOrder === 'asc' ? index + 1 : undefined}
                />
              ))}
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mt-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {showComparison && (
          <ProductComparison
            products={selectedProducts}
            onClose={() => setShowComparison(false)}
          />
        )}
      </div>
    </div>
  );
};
