export type PropertyType = 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL' | 'OTHER';

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
  propertyType: PropertyType;
  images: string[];
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
