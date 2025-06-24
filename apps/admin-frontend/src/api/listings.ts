import axios from 'axios';

export type PropertyType = 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL' | 'OTHER';

export interface ImageData {
  url: string;
  name: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt?: number;
  images: ImageData[];
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingDto {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt?: number;
  images: ImageData[];
  features: string[];
}

export interface UpdateListingDto extends Partial<CreateListingDto> {
  isActive?: boolean;
}

export interface FetchListingsParams {
  search?: string;
}

export const fetchListings = (params?: FetchListingsParams) => 
  axios.get<Listing[]>('/api/listings', { params }).then(res => res.data);

export const fetchListing = (id: number) => axios.get<Listing>(`/api/listings/${id}`);
export const createListing = (data: CreateListingDto) => axios.post<Listing>('/api/listings', data);
export const updateListing = (id: number, data: UpdateListingDto) => axios.patch<Listing>(`/api/listings/${id}`, data);
export const deleteListing = (id: number) => axios.delete(`/api/listings/${id}`);
