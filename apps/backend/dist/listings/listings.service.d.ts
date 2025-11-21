import { Repository } from 'typeorm';
import { Listing } from './listing.entity';
import { CreateListingDto, UpdateListingDto } from './listing.dto';
import { FeaturesService } from '../features/features.service';
type FindAllOptions = {
    search?: string;
    query?: string;
    featureIds?: number[];
    propertyType?: string[];
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    minBathrooms?: number;
    minArea?: number;
    maxArea?: number;
    hasGarage?: boolean | string;
    hasParking?: boolean | string;
    hasAC?: boolean | string;
    hasPool?: boolean | string;
    sortBy?: 'newest' | 'price_asc' | 'price_desc';
    limit?: number;
};
export declare class ListingsService {
    private listingsRepository;
    private featuresService;
    constructor(listingsRepository: Repository<Listing>, featuresService: FeaturesService);
    create(createDto: CreateListingDto): Promise<Listing>;
    findAll({ search, query, featureIds, propertyType, minPrice, maxPrice, bedrooms, minBathrooms, minArea, maxArea, hasGarage, hasParking, hasAC, hasPool, sortBy, limit }?: FindAllOptions): Promise<Listing[]>;
    findOne(id: number): Promise<Listing>;
    findFeatured(): Promise<Listing[]>;
    update(id: number, updateDto: UpdateListingDto): Promise<Listing>;
    remove(id: number): Promise<void>;
    removeAll(): Promise<void>;
}
export {};
