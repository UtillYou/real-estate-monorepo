import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './listing.entity';
import { CreateListingDto, UpdateListingDto } from './listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
  ) {}

  create(createDto: CreateListingDto): Promise<Listing> {
    const listing = this.listingsRepository.create(createDto);
    return this.listingsRepository.save(listing);
  }

  findAll(): Promise<Listing[]> {
    return this.listingsRepository.find();
  }

  async findOne(id: number): Promise<Listing> {
    const listing = await this.listingsRepository.findOneBy({ id });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async update(id: number, updateDto: UpdateListingDto): Promise<Listing> {
    const listing = await this.listingsRepository.findOneBy({ id });
    if (!listing) throw new NotFoundException('Listing not found');
    Object.assign(listing, updateDto);
    return this.listingsRepository.save(listing);
  }

  async remove(id: number): Promise<void> {
    const result = await this.listingsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Listing not found');
  }
}
