import { Product, SearchParams } from '../shared/types';
import { generateSampleProducts } from './sampleData';
import { DataProcessor } from './dataProcessor';

export class SearchService {
  static async search(params: SearchParams): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let products = generateSampleProducts(params.keyword);
        
        if (params.platforms && params.platforms.length > 0) {
          products = products.filter(p => params.platforms!.includes(p.platform));
        }
        
        if (params.limit) {
          products = products.slice(0, params.limit);
        }

        products = DataProcessor.cleanAndDeduplicate(products);
        products = DataProcessor.calculateCostPerformance(products);
        products = DataProcessor.sortProducts(products, 'price', 'asc');

        resolve(products);
      }, 800);
    });
  }

  static async getSampleData(): Promise<Product[]> {
    let products = generateSampleProducts('iPhone');
    products = DataProcessor.cleanAndDeduplicate(products);
    products = DataProcessor.calculateCostPerformance(products);
    products = DataProcessor.sortProducts(products, 'price', 'asc');
    return products;
  }
}
