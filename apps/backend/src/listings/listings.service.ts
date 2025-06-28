import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Listing } from './listing.entity';
import { CreateListingDto, UpdateListingDto } from './listing.dto';
import { FeaturesService } from '../features/features.service';
import { Feature } from '../features/feature.entity';

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

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    @Inject(forwardRef(() => FeaturesService))
    private featuresService: FeaturesService,
  ) {}

  async create(createDto: CreateListingDto): Promise<Listing> {
    const listing = new Listing();
    Object.assign(listing, createDto);
    
    if (createDto.featureIds && createDto.featureIds.length > 0) {
      listing.features = await this.featuresService.findByIds(createDto.featureIds);
    }
    
    return this.listingsRepository.save(listing);
  }

  async findAll({
    search,
    query,
    featureIds,
    propertyType,
    minPrice,
    maxPrice,
    bedrooms,
    minBathrooms = 1,
    minArea = 0,
    maxArea = 10000,
    hasGarage,
    hasParking,
    hasAC,
    hasPool,
    sortBy = 'newest',
    limit
  }: FindAllOptions = {}): Promise<Listing[]> {
    const queryBuilder = this.listingsRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.features', 'features');
    
    // Handle search query (from search bar)
    const searchTerm = search || query;
    if (searchTerm) {
      const searchPattern = `%${searchTerm.toLowerCase()}%`;
      queryBuilder.andWhere(
        '(LOWER(listing.title) LIKE :search OR LOWER(listing.address) LIKE :search OR LOWER(listing.description) LIKE :search)',
        { search: searchPattern }
      );
    }
    
    // Handle features filter
    if (featureIds && featureIds.length > 0) {
      queryBuilder.andWhere('features.id IN (:...featureIds)', { featureIds });
    }
    
    // Handle property type filter
    if (propertyType && propertyType.length > 0) {
      queryBuilder.andWhere('listing.propertyType IN (:...propertyType)', { propertyType });
    }
    
    // Handle price range
    if (minPrice !== undefined) {
      queryBuilder.andWhere('listing.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('listing.price <= :maxPrice', { maxPrice });
    }
    
    // Handle bedrooms
    if (bedrooms !== undefined) {
      queryBuilder.andWhere('listing.bedrooms >= :bedrooms', { bedrooms });
    }
    
    // Handle bathrooms
    if (minBathrooms !== undefined) {
      queryBuilder.andWhere('listing.bathrooms >= :minBathrooms', { minBathrooms });
    }
    
    // Handle area range
    if (minArea !== undefined) {
      queryBuilder.andWhere('listing.area >= :minArea', { minArea });
    }
    if (maxArea !== undefined) {
      queryBuilder.andWhere('listing.area <= :maxArea', { maxArea });
    }
    
    // Handle boolean filters
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

    // Apply sorting
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

    // Apply limit if provided
    if (limit) {
      queryBuilder.take(limit);
    }
    
    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({ 
      where: { id },
      relations: ['features']
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async findFeatured(): Promise<Listing[]> {
    return this.listingsRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.features', 'features')
      .where('features.id IS NOT NULL')
      .andWhere('listing.isActive = :isActive', { isActive: true })
      .orderBy('listing.createdAt', 'DESC')
      .take(8)
      .getMany();
  }

  async update(id: number, updateDto: UpdateListingDto): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({ 
      where: { id },
      relations: ['features']
    });
    
    if (!listing) throw new NotFoundException('Listing not found');
    
    if (updateDto.featureIds && updateDto.featureIds.length > 0) {
      const features = await this.featuresService.findByIds(updateDto.featureIds);
      listing.features = features;
      delete updateDto.featureIds; // Remove to prevent overwrite in Object.assign
    }
    
    Object.assign(listing, updateDto);
    return this.listingsRepository.save(listing);
  }

  async remove(id: number): Promise<void> {
    const queryRunner = this.listingsRepository.manager.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // First, load the listing with features to ensure it exists
      const listing = await queryRunner.manager.findOne(Listing, {
        where: { id },
        relations: ['features']
      });
      
      if (!listing) {
        throw new NotFoundException('Listing not found');
      }
      
      // Remove all features from the listing (this handles the join table)
      listing.features = [];
      await queryRunner.manager.save(listing);
      
      // Then delete the listing
      await queryRunner.manager.remove(listing);
      
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async removeAll(): Promise<void> {
    const queryRunner = this.listingsRepository.manager.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      console.log('Starting to delete all listings...');
      
      // First, delete all entries from the join table
      await queryRunner.query('DELETE FROM listing_features');
      
      // Then delete all listings
      await queryRunner.query('DELETE FROM listings');
      
      await queryRunner.commitTransaction();
      console.log('Successfully deleted all listings');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error in removeAll:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
