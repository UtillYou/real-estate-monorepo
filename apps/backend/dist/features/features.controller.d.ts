import { FeaturesService } from './features.service';
import { Feature } from './feature.entity';
import { CreateFeatureDto } from './feature.dto';
import { UpdateFeatureDto } from './feature.dto';
export declare class FeaturesController {
    private readonly featuresService;
    constructor(featuresService: FeaturesService);
    create(createFeatureDto: CreateFeatureDto): Promise<Feature>;
    findAll(): Promise<Feature[]>;
    findOne(id: string): Promise<Feature>;
    update(id: string, updateFeatureDto: UpdateFeatureDto): Promise<Feature>;
    remove(id: string): Promise<void>;
}
