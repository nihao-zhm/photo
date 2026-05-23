import React from 'react';
import { Product, PLATFORMS } from '../../shared/types';
import { X, Trophy, Star, ShoppingCart, ExternalLink, TrendingUp } from 'lucide-react';

interface ProductComparisonProps {
  products: Product[];
  onClose: () => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({ products, onClose }) => {
  const sortedProducts = React.useMemo(() => {
    return [...products].sort((a, b) => (b.costPerformance || 0) - (a.costPerformance || 0));
  }, [products]);

  if (products.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-success-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy size={24} />
            商品横向对比
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left font-semibold text-gray-600 w-40 border-b">
                  对比项
                </th>
                {sortedProducts.map((product, index) => {
                  const platform = PLATFORMS[product.platform];
                  const isBest = index === 0;
                  
                  return (
                    <th 
                      key={product.id} 
                      className={`px-6 py-4 text-center border-b min-w-[200px] ${
                        isBest ? 'bg-success-50' : ''
                      }`}
                    >
                      <div className="space-y-2">
                        {isBest && (
                          <div className="inline-flex items-center gap-1 bg-success-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            <Trophy size={12} />
                            性价比最高
                          </div>
                        )}
                        <div 
                          className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: platform.color }}
                        >
                          {platform.icon} {platform.name}
                        </div>
                        <div className="font-semibold text-gray-800 line-clamp-2 text-sm">
                          {product.name}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-6 py-4 font-medium text-gray-600 bg-gray-50">
                  价格
                </td>
                {sortedProducts.map((product, index) => (
                  <td 
                    key={product.id} 
                    className={`px-6 py-4 text-center ${index === 0 ? 'bg-success-50' : ''}`}
                  >
                    <div className="text-2xl font-bold text-red-600">
                      ¥{product.price.toLocaleString()}
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-400 line-through">
                        ¥{product.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              <tr className="bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-600 bg-gray-50">
                  销量
                </td>
                {sortedProducts.map((product, index) => (
                  <td 
                    key={product.id} 
                    className={`px-6 py-4 text-center ${index === 0 ? 'bg-success-50' : ''}`}
                  >
                    <div className="flex items-center justify-center gap-1 text-gray-700">
                      <ShoppingCart size={16} />
                      {product.sales.toLocaleString()}
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-6 py-4 font-medium text-gray-600 bg-gray-50">
                  评分
                </td>
                {sortedProducts.map((product, index) => (
                  <td 
                    key={product.id} 
                    className={`px-6 py-4 text-center ${index === 0 ? 'bg-success-50' : ''}`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-700">{product.rating}</span>
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-600 bg-gray-50">
                  店铺
                </td>
                {sortedProducts.map((product, index) => (
                  <td 
                    key={product.id} 
                    className={`px-6 py-4 text-center ${index === 0 ? 'bg-success-50' : ''}`}
                  >
                    <span className="text-gray-600">{product.shopName}</span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-6 py-4 font-medium text-gray-600 bg-gray-50">
                  性价比
                </td>
                {sortedProducts.map((product, index) => (
                  <td 
                    key={product.id} 
                    className={`px-6 py-4 text-center ${index === 0 ? 'bg-success-50' : ''}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {index === 0 && <TrendingUp size={18} className="text-success-500" />}
                      <div className="flex-1 max-w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${product.costPerformance || 0}%`,
                            backgroundColor: index === 0 ? '#10B981' : (product.costPerformance || 0) >= 70 ? '#10B981' : (product.costPerformance || 0) >= 40 ? '#F59E0B' : '#EF4444'
                          }}
                        />
                      </div>
                      <span className={`font-bold text-sm w-10 ${
                        index === 0 ? 'text-success-600' : (product.costPerformance || 0) >= 70 ? 'text-success-600' : (product.costPerformance || 0) >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {(product.costPerformance || 0).toFixed(1)}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-600 bg-gray-50">
                  操作
                </td>
                {sortedProducts.map((product, index) => (
                  <td 
                    key={product.id} 
                    className={`px-6 py-4 text-center ${index === 0 ? 'bg-success-50' : ''}`}
                  >
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
                        index === 0 
                          ? 'bg-success-500 text-white hover:bg-success-600' 
                          : 'bg-primary-500 text-white hover:bg-primary-600'
                      }`}
                    >
                      去购买
                      <ExternalLink size={14} />
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <p className="text-gray-500 text-sm text-center">
            💡 提示：性价比综合考虑了价格、销量和评分进行计算
          </p>
        </div>
      </div>
    </div>
  );
};
