import { PropertyType } from './types/property-type.enum';
export declare class CreateListingDto {
    title: string;
    description: string;
    propertyType: PropertyType;
    price: number;
    address: string;
    city: string;
    state?: string;
    zipCode?: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    yearBuilt?: number;
    featureIds?: number[];
    imageUrls: string[];
    isActive?: boolean;
}
export declare class UpdateListingDto {
    title?: string;
    description?: string;
    propertyType?: PropertyType;
    price?: number;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    yearBuilt?: number;
    featureIds?: number[];
    images?: Array<{
        url: string;
        name: string;
    }>;
    isActive?: boolean;
}
