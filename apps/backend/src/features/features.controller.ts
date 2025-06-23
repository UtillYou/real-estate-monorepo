import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { Feature } from './feature.entity';
import { CreateFeatureDto } from './feature.dto';
import { UpdateFeatureDto } from './feature.dto';

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  create(@Body() createFeatureDto: CreateFeatureDto): Promise<Feature> {
    return this.featuresService.create(createFeatureDto);
  }

  @Get()
  findAll(): Promise<Feature[]> {
    return this.featuresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Feature> {
    return this.featuresService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeatureDto: UpdateFeatureDto,
  ): Promise<Feature> {
    return this.featuresService.update(+id, updateFeatureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.featuresService.remove(+id);
  }
}
