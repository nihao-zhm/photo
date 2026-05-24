import React from 'react';
import { Product, PLATFORMS } from '../../shared/types';
import { CheckCircle2, Circle, ExternalLink, Star, ShoppingCart, TrendingUp } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onToggle: () => void;
  rank?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, selected, onToggle, rank }) => {
  const platform = PLATFORMS[product.platform];
  const isHighValue = product.costPerformance && product.costPerformance >= 70;

  return (
    <div 
      className={`relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-2 ${
        selected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-transparent'
      }`}
      onClick={onToggle}
    >
      {rank && rank <= 3 && (
        <div className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
          rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-600'
        }`}>
          {rank}
        </div>
      )}

      {isHighValue && (
        <div className="absolute top-3 right-3 z-10 bg-success-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
          <TrendingUp size={12} />
          高性价比
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-4">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0 mt-1"
            style={{ backgroundColor: platform.color }}
            onClick={(e) => e.stopPropagation()}
          >
            {selected ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </div>

          <div className="flex-1 min-w-0">
            <div 
              className="flex items-center gap-2 mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-lg">{platform.icon}</span>
              <span 
                className="text-sm font-medium px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: platform.color }}
              >
                {platform.name}
              </span>
            </div>

            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 leading-snug">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-red-600">
                ¥{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ¥{product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <ShoppingCart size={14} />
                <span>{product.sales.toLocaleString()} 销量</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span>{product.rating}</span>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-3">
              <span className="font-medium">{product.shopName}</span>
            </div>

            {product.costPerformance !== undefined && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${product.costPerformance}%`,
                      backgroundColor: product.costPerformance >= 70 ? '#10B981' : product.costPerformance >= 40 ? '#F59E0B' : '#EF4444'
                    }}
                  />
                </div>
                <span className={`text-xs font-medium w-12 text-right ${
                  product.costPerformance >= 70 ? 'text-success-500' : product.costPerformance >= 40 ? 'text-yellow-600' : 'text-red-500'
                }`}>
                  {product.costPerformance.toFixed(1)}分
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            去购买
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
