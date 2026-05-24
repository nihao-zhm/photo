export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  sales: number;
  rating: number;
  shopName: string;
  platform: 'jd' | 'taobao' | 'pinduoduo';
  url: string;
  imageUrl?: string;
  description?: string;
  category?: string;
  collectedAt: Date;
  costPerformance?: number;
}

export interface SearchParams {
  keyword: string;
  platforms?: ('jd' | 'taobao' | 'pinduoduo')[];
  limit?: number;
}

export interface SearchResponse {
  success: boolean;
  data: Product[];
  total: number;
  message?: string;
}

export interface PlatformConfig {
  name: string;
  color: string;
  icon: string;
}

export const PLATFORMS: Record<string, PlatformConfig> = {
  jd: { name: '京东', color: '#E4393C', icon: '🛒' },
  taobao: { name: '淘宝', color: '#FF5000', icon: '🎁' },
  pinduoduo: { name: '拼多多', color: '#E02E24', icon: '📦' }
};
