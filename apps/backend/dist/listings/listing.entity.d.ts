import { PropertyType } from './types/property-type.enum';
import { Feature } from '../features/feature.entity';
export declare class Listing {
    id: number;
    title: string;
    description: string;
    propertyType: PropertyType;
    price: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    yearBuilt: number;
    images: Array<{
        url: string;
        name: string;
    }>;
    features: Feature[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
