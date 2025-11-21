import { ListingsService } from './listings.service';
import { CreateListingDto, UpdateListingDto } from './listing.dto';
export declare class ListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    create(createListingDto: CreateListingDto): Promise<import("./listing.entity").Listing>;
    findAll(search?: string, query?: string, featureIds?: string, propertyType?: string, minPrice?: number, maxPrice?: number, bedrooms?: number, minBathrooms?: number, minArea?: number, maxArea?: number, hasGarage?: string, hasParking?: string, hasAC?: string, hasPool?: string, sortBy?: 'newest' | 'price_asc' | 'price_desc', limit?: number): Promise<import("./listing.entity").Listing[]>;
    findFeatured(): Promise<import("./listing.entity").Listing[]>;
    findOne(id: number): Promise<import("./listing.entity").Listing>;
    update(id: number, updateListingDto: UpdateListingDto): Promise<import("./listing.entity").Listing>;
    removeAll(): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<void>;
}
