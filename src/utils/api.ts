import { SearchParams, SearchResponse } from '../../shared/types';

const API_BASE = '/api';

export async function fetchSampleData(): Promise<SearchResponse> {
  const response = await fetch(`${API_BASE}/sample`);
  if (!response.ok) {
    throw new Error('Failed to fetch sample data');
  }
  return response.json();
}

export async function searchProducts(params: SearchParams): Promise<SearchResponse> {
  const response = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    throw new Error('Failed to search products');
  }
  
  return response.json();
}
