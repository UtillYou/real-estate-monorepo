import { Listing } from '../listings/listing.entity';
export declare class Feature {
    id: number;
    name: string;
    icon?: string;
    listings: Listing[];
    createdAt: Date;
    updatedAt: Date;
}
