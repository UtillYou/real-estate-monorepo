"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const listing_entity_1 = require("./listing.entity");
const features_service_1 = require("../features/features.service");
let ListingsService = class ListingsService {
    listingsRepository;
    featuresService;
    constructor(listingsRepository, featuresService) {
        this.listingsRepository = listingsRepository;
        this.featuresService = featuresService;
    }
    async create(createDto) {
        const listing = new listing_entity_1.Listing();
        Object.assign(listing, createDto);
        if (createDto.featureIds && createDto.featureIds.length > 0) {
            listing.features = await this.featuresService.findByIds(createDto.featureIds);
        }
        return this.listingsRepository.save(listing);
    }
    async findAll({ search, query, featureIds, propertyType, minPrice, maxPrice, bedrooms, minBathrooms = 1, minArea = 0, maxArea = 10000, hasGarage, hasParking, hasAC, hasPool, sortBy = 'newest', limit } = {}) {
        const queryBuilder = this.listingsRepository
            .createQueryBuilder('listing')
            .leftJoinAndSelect('listing.features', 'features');
        const searchTerm = search || query;
        if (searchTerm) {
            const searchPattern = `%${searchTerm.toLowerCase()}%`;
            queryBuilder.andWhere('(LOWER(listing.title) LIKE :search OR LOWER(listing.address) LIKE :search OR LOWER(listing.description) LIKE :search)', { search: searchPattern });
        }
        if (featureIds && featureIds.length > 0) {
            queryBuilder.andWhere('features.id IN (:...featureIds)', { featureIds });
        }
        if (propertyType && propertyType.length > 0) {
            queryBuilder.andWhere('listing.propertyType IN (:...propertyType)', { propertyType });
        }
        if (minPrice !== undefined) {
            queryBuilder.andWhere('listing.price >= :minPrice', { minPrice });
        }
        if (maxPrice !== undefined) {
            queryBuilder.andWhere('listing.price <= :maxPrice', { maxPrice });
        }
        if (bedrooms !== undefined) {
            queryBuilder.andWhere('listing.bedrooms >= :bedrooms', { bedrooms });
        }
        if (minBathrooms !== undefined) {
            queryBuilder.andWhere('listing.bathrooms >= :minBathrooms', { minBathrooms });
        }
        if (minArea !== undefined) {
            queryBuilder.andWhere('listing.squareFeet >= :minArea', { minArea });
        }
        if (maxArea !== undefined) {
            queryBuilder.andWhere('listing.squareFeet <= :maxArea', { maxArea });
        }
        const booleanFilters = [
            { field: 'hasGarage', value: hasGarage },
            { field: 'hasParking', value: hasParking },
            { field: 'hasAC', value: hasAC },
            { field: 'hasPool', value: hasPool },
        ];
        booleanFilters.forEach(({ field, value }) => {
            if (value !== undefined) {
                const boolValue = typeof value === 'string' ? value === 'true' : value;
                if (boolValue) {
                    queryBuilder.andWhere(`listing.${field} = :${field}`, { [field]: true });
                }
            }
        });
        switch (sortBy) {
            case 'price_asc':
                queryBuilder.orderBy('listing.price', 'ASC');
                break;
            case 'price_desc':
                queryBuilder.orderBy('listing.price', 'DESC');
                break;
            case 'newest':
            default:
                queryBuilder.orderBy('listing.createdAt', 'DESC');
                break;
        }
        if (limit) {
            queryBuilder.take(limit);
        }
        return queryBuilder.getMany();
    }
    async findOne(id) {
        const listing = await this.listingsRepository.findOne({
            where: { id },
            relations: ['features']
        });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        return listing;
    }
    async findFeatured() {
        return this.listingsRepository
            .createQueryBuilder('listing')
            .leftJoinAndSelect('listing.features', 'features')
            .where('features.id IS NOT NULL')
            .andWhere('listing.isActive = :isActive', { isActive: true })
            .orderBy('listing.createdAt', 'DESC')
            .take(8)
            .getMany();
    }
    async update(id, updateDto) {
        const listing = await this.listingsRepository.findOne({
            where: { id },
            relations: ['features']
        });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        if (updateDto.featureIds && updateDto.featureIds.length > 0) {
            const features = await this.featuresService.findByIds(updateDto.featureIds);
            listing.features = features;
            delete updateDto.featureIds;
        }
        Object.assign(listing, updateDto);
        return this.listingsRepository.save(listing);
    }
    async remove(id) {
        const queryRunner = this.listingsRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const listing = await queryRunner.manager.findOne(listing_entity_1.Listing, {
                where: { id },
                relations: ['features']
            });
            if (!listing) {
                throw new common_1.NotFoundException('Listing not found');
            }
            listing.features = [];
            await queryRunner.manager.save(listing);
            await queryRunner.manager.remove(listing);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async removeAll() {
        const queryRunner = this.listingsRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            console.log('Starting to delete all listings...');
            await queryRunner.query('DELETE FROM listing_features');
            await queryRunner.query('DELETE FROM listings');
            await queryRunner.commitTransaction();
            console.log('Successfully deleted all listings');
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error in removeAll:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(listing_entity_1.Listing)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => features_service_1.FeaturesService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        features_service_1.FeaturesService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map