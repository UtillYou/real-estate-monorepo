import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature } from './feature.entity';
import { CreateFeatureDto } from './feature.dto';
import { UpdateFeatureDto } from './feature.dto';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private featuresRepository: Repository<Feature>,
  ) {}

  async create(createFeatureDto: CreateFeatureDto): Promise<Feature> {
    const feature = this.featuresRepository.create(createFeatureDto);
    return this.featuresRepository.save(feature);
  }

  async findAll(): Promise<Feature[]> {
    return this.featuresRepository.find();
  }

  async findOne(id: number): Promise<Feature> {
    const feature = await this.featuresRepository.findOne({ where: { id } });
    if (!feature) {
      throw new NotFoundException(`Feature with ID ${id} not found`);
    }
    return feature;
  }

  async update(id: number, updateFeatureDto: UpdateFeatureDto): Promise<Feature> {
    const feature = await this.findOne(id);
    Object.assign(feature, updateFeatureDto);
    return this.featuresRepository.save(feature);
  }

  async remove(id: number): Promise<void> {
    const result = await this.featuresRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Feature with ID ${id} not found`);
    }
  }

  async findByIds(ids: number[]): Promise<Feature[]> {
    return this.featuresRepository
      .createQueryBuilder('feature')
      .where('feature.id IN (:...ids)', { ids })
      .getMany();
  }
}
