import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Listing } from './listing.entity';
import { CreateListingDto, UpdateListingDto } from './listing.dto';
import { FeaturesService } from '../features/features.service';
import { Feature } from '../features/feature.entity';

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

  async findAll(search?: string, featureIds?: number[]): Promise<Listing[]> {
    const query = this.listingsRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.features', 'features');
    
    if (search) {
      const searchTerm = `%${search.toLowerCase()}`;
      query.andWhere(
        '(LOWER(listing.title) LIKE :search OR LOWER(listing.address) LIKE :search)',
        { search: searchTerm }
      );
    }
    
    if (featureIds && featureIds.length > 0) {
      query.andWhere('features.id IN (:...featureIds)', { featureIds });
    }
    
    return query.getMany();
  }

  async findOne(id: number): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({ 
      where: { id },
      relations: ['features']
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async update(id: number, updateDto: UpdateListingDto): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({ 
      where: { id },
      relations: ['features']
    });
    
    if (!listing) throw new NotFoundException('Listing not found');
    
    if (updateDto.featureIds) {
      const features = await this.featuresService.findByIds(updateDto.featureIds);
      listing.features = features;
      delete updateDto.featureIds; // Remove to prevent overwrite in Object.assign
    }
    
    Object.assign(listing, updateDto);
    return this.listingsRepository.save(listing);
  }

  async remove(id: number): Promise<void> {
    const result = await this.listingsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Listing not found');
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
