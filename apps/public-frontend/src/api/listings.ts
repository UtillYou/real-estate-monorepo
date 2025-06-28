import axios from 'axios';

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL' | 'OTHER';
  images: {url:string,name:string}[];
  isActive: boolean;
  features: Array<{
    id: number;
    name: string;
    icon: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
}

export interface SearchFilters extends SearchParams {
  minBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  hasGarage?: boolean;
  hasParking?: boolean;
  hasAC?: boolean;
  hasPool?: boolean;
}

// Create axios instance with base config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchListings = (params?: SearchFilters) => 
  api.get<Listing[]>('/listings', { 
    params: {
      ...params,
      // Convert boolean filters to strings that can be properly serialized
      ...(params?.hasGarage !== undefined && { hasGarage: String(params.hasGarage) }),
      ...(params?.hasParking !== undefined && { hasParking: String(params.hasParking) }),
      ...(params?.hasAC !== undefined && { hasAC: String(params.hasAC) }),
      ...(params?.hasPool !== undefined && { hasPool: String(params.hasPool) }),
    } 
  });

export const fetchListing = (id: number) => 
  api.get<Listing>(`/listings/${id}`);

export const fetchFeaturedListings = () => 
  api.get<Listing[]>('/listings/featured');

export const fetchLatestListings = (limit: number = 4) => 
  api.get<Listing[]>('/listings', { 
    params: { 
      sortBy: 'newest',
      limit: limit.toString()
    } 
  });

// For typeahead search, we'll use the main listings endpoint with search query
export const searchListings = (query: string, limit: number = 5) =>
  api.get<Listing[]>('/listings', {
    params: {
      search: query,
      limit: limit.toString(),
      sortBy: 'relevance' // Assuming your backend supports this
    }
  });
