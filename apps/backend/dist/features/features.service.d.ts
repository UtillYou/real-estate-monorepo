import { Repository } from 'typeorm';
import { Feature } from './feature.entity';
import { CreateFeatureDto } from './feature.dto';
import { UpdateFeatureDto } from './feature.dto';
export declare class FeaturesService {
    private featuresRepository;
    constructor(featuresRepository: Repository<Feature>);
    create(createFeatureDto: CreateFeatureDto): Promise<Feature>;
    findAll(): Promise<Feature[]>;
    findOne(id: number): Promise<Feature>;
    update(id: number, updateFeatureDto: UpdateFeatureDto): Promise<Feature>;
    remove(id: number): Promise<void>;
    findByIds(ids: number[]): Promise<Feature[]>;
}
