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

export const fetchListings = (params?: SearchParams) => 
  axios.get<Listing[]>('/api/listings', { params });

export const fetchListing = (id: number) => 
  axios.get<Listing>(`/api/listings/${id}`);

export const fetchFeaturedListings = () => 
  axios.get<Listing[]>('/api/listings/featured');

export const fetchLatestListings = (limit: number = 4) => 
  axios.get<Listing[]>('/api/listings', { 
    params: { 
      sortBy: 'newest',
      limit
    } 
  });
