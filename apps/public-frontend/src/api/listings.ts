import axios from 'axios';

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const fetchListings = () => axios.get<Listing[]>('/api/listings');
export const fetchListing = (id: number) => axios.get<Listing>(`/api/listings/${id}`);
