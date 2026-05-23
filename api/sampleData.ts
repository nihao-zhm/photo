import { Product } from '../shared/types';

export const generateSampleProducts = (keyword: string = 'iPhone'): Product[] => {
  const products: Product[] = [];
  const platforms: ('jd' | 'taobao' | 'pinduoduo')[] = ['jd', 'taobao', 'pinduoduo'];
  
  const productNames = [
    `${keyword} 15 Pro Max 256GB`,
    `${keyword} 15 Pro 128GB`,
    `${keyword} 15 256GB`,
    `${keyword} 14 Pro Max 256GB`,
    `${keyword} 14 Pro 128GB`,
    `${keyword} 14 256GB`,
    `${keyword} 13 128GB 全新`,
    `${keyword} SE 第三代`,
    `${keyword} 12 256GB 二手`,
    `${keyword} 11 128GB`
  ];

  const shopNames = [
    '苹果官方旗舰店',
    '数码专营店',
    '手机专卖店',
    '果粉俱乐部',
    '科技数码城',
    '智能生活館',
    '优品数码店',
    '诚信手机店'
  ];

  platforms.forEach((platform) => {
    const basePrice = platform === 'jd' ? 8999 : platform === 'taobao' ? 8599 : 7999;
    
    productNames.forEach((name, index) => {
      const priceVariation = (Math.random() - 0.5) * 2000;
      const price = Math.max(1999, Math.floor(basePrice + priceVariation - index * 500));
      const originalPrice = Math.floor(price * (1 + Math.random() * 0.3));
      
      products.push({
        id: `${platform}-${index}-${Date.now()}`,
        name,
        price,
        originalPrice: price < originalPrice ? originalPrice : undefined,
        sales: Math.floor(Math.random() * 50000) + 100,
        rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
        shopName: shopNames[Math.floor(Math.random() * shopNames.length)],
        platform,
        url: `https://www.${platform === 'jd' ? 'jd' : platform === 'taobao' ? 'taobao' : 'yangkeduo'}.com/product/${index}`,
        imageUrl: `https://picsum.photos/seed/${platform}${index}/200/200`,
        description: `正品保证，全国联保，支持7天无理由退换`,
        category: '手机',
        collectedAt: new Date()
      });
    });
  });

  return products;
};

export const SAMPLE_PRODUCTS = generateSampleProducts('iPhone');
