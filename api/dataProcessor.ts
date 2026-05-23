import { Product } from '../shared/types';

export class DataProcessor {
  static cleanAndDeduplicate(products: Product[]): Product[] {
    const seen = new Set<string>();
    const cleaned: Product[] = [];

    for (const product of products) {
      if (product.price <= 0) continue;
      
      const nameKey = product.name.toLowerCase().replace(/\s+/g, '');
      const priceKey = Math.round(product.price / 100) * 100;
      const key = `${product.platform}-${nameKey}-${priceKey}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        cleaned.push(product);
      }
    }

    return cleaned;
  }

  static sortProducts(products: Product[], sortBy: 'price' | 'sales' | 'rating' = 'price', order: 'asc' | 'desc' = 'asc'): Product[] {
    return [...products].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'sales':
          comparison = b.sales - a.sales;
          break;
        case 'rating':
          comparison = b.rating - a.rating;
          break;
      }
      
      return order === 'desc' ? -comparison : comparison;
    });
  }

  static calculateCostPerformance(products: Product[]): Product[] {
    if (products.length === 0) return products;

    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const sales = products.map(p => p.sales);
    const minSales = Math.min(...sales);
    const maxSales = Math.max(...sales);

    return products.map(product => {
      const normalizedPrice = 1 - ((product.price - minPrice) / (maxPrice - minPrice || 1));
      const normalizedSales = (product.sales - minSales) / (maxSales - minSales || 1);
      const normalizedRating = product.rating / 5;

      const costPerformance = (
        normalizedPrice * 0.4 +
        normalizedSales * 0.3 +
        normalizedRating * 0.3
      ) * 100;

      return {
        ...product,
        costPerformance: parseFloat(costPerformance.toFixed(2))
      };
    });
  }

  static getPriceStatistics(products: Product[]) {
    if (products.length === 0) {
      return { min: 0, max: 0, avg: 0, median: 0 };
    }

    const prices = products.map(p => p.price).sort((a, b) => a - b);
    const min = prices[0];
    const max = prices[prices.length - 1];
    const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const median = prices.length % 2 === 0
      ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
      : prices[Math.floor(prices.length / 2)];

    return { min, max, avg: parseFloat(avg.toFixed(2)), median };
  }

  static getPlatformDistribution(products: Product[]) {
    const distribution: Record<string, number> = {};
    
    products.forEach(p => {
      distribution[p.platform] = (distribution[p.platform] || 0) + 1;
    });

    return distribution;
  }
}
